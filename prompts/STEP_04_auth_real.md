# PROMPT CLAUDE — ÉTAPE 04 : Authentification réelle (Remplacer le login hardcodé)

> 🎯 **OBJECTIF** : Remplacer le login mock (`directeur@strelitzia.test`) par une authentification réelle Supabase dans l'application `apps/admin` avec gestion multi-tenant, redirection par rôle, et sécurité anti cross-tenant.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/vitrine` : Next.js 14 (site public)
- `apps/admin` : Next.js 14 (portail administration)
- `apps/desktop` : Electron 30 + Vite + React (secrétariat offline)
- `apps/mobile` : Expo 51 (suivi parents/élèves)
- `apps/kids` : Expo 51 (app enfant gamifiée)
- `packages/shared` : Types, DB helpers, client Supabase partagé (`@edusmart/shared`)
- `packages/ui` : Design tokens partagés

Le client Supabase et le schéma de base de données sont déjà configurés.

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

| Fichier | Action | Description |
|---|---|---|
| `apps/admin/src/app/login/page.tsx` | **Modifier** | Remplacer le mock par un vrai formulaire d'authentification Supabase. |
| `apps/admin/src/app/login/actions.ts` | **Créer** | Server Actions pour le login par mot de passe, Magic Link, OAuth Google et déconnexion. |
| `apps/admin/src/app/auth/callback/route.ts` | **Créer** | Route handler de callback pour échanger le code OAuth/Magic Link contre une session. |
| `apps/admin/src/middleware.ts` | **Modifier** | Protéger les routes non publiques de l'administration et rafraîchir la session. |
| `apps/admin/src/lib/auth-helpers.ts` | **Créer** | Helpers pour récupérer le profil connecté, vérifier les rôles et gérer les redirections. |
| `apps/admin/src/lib/admin-tenant.ts` | **Modifier** | Ajouter la vérification stricte anti cross-tenant (`profile.organization_id === tenant.id`). |
| `apps/admin/src/app/post-login/page.tsx` | **Créer** | Page de transition post-login pour rediriger selon le rôle utilisateur. |

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez implémenter les étapes suivantes dans `apps/admin` :

### 1. Créer les Server Actions de connexion (`apps/admin/src/app/login/actions.ts`)
Définir les fonctions serveur pour gérer :
*   `signInWithPassword(formData)` : Connexion email + mot de passe. Redirige vers `/post-login`.
*   `signInWithOAuth(provider, schoolSlug)` : Connexion Google OAuth avec redirection vers le callback en passant le slug de l'école dans l'URL.
*   `signOut()` : Déconnexion complète de l'utilisateur.

```typescript
'use server'

import { createSupabaseServerClient } from '@edusmart/shared'
import { redirect } from 'next/navigation'

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/post-login')
}

export async function signInWithOAuth(provider: 'google', schoolSlug: string) {
  const supabase = createSupabaseServerClient()
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'edusmart.site'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `https://${schoolSlug}.${rootDomain}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  redirect(data.url)
}

export async function signOut() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

### 2. Formulaire de Login (`apps/admin/src/app/login/page.tsx`)
Adapter la page de login pour utiliser les Server Actions. Elle doit récupérer le slug de l'école via `getAdminTenant()` pour afficher le nom de l'école et configurer le bouton Google OAuth.

### 3. Middleware d'Authentification (`apps/admin/src/middleware.ts`)
*   Mettre à jour le middleware pour intercepter toutes les requêtes (sauf assets et `/login`, `/auth/callback`).
*   Utiliser `updateSupabaseSession(req)` de `@edusmart/shared` pour rafraîchir le cookie de session.
*   Si aucune session active n'existe (`supabase.auth.getUser()` est nul), rediriger vers `/login`.

### 4. Callback Route (`apps/admin/src/app/auth/callback/route.ts`)
Créer la route GET pour finaliser l'échange de code OAuth ou Magic Link :
```typescript
import { createSupabaseServerClient } from '@edusmart/shared'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Error exchanging code:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_exchange_failed`)
    }
  }

  return NextResponse.redirect(`${origin}/post-login`)
}
```

### 5. Helpers d'authentification (`apps/admin/src/lib/auth-helpers.ts`)
Créer des fonctions pour récupérer le profil connecté dans la base de données public.profiles :
*   `getCurrentProfile()` : Récupère le profil de l'utilisateur connecté ou redirige vers `/login`.
*   `requireRole(allowedRoles)` : Bloque l'accès si le rôle de l'utilisateur ne fait pas partie des rôles autorisés.
*   `redirectByRole(role)` : Associe chaque rôle à sa page de redirection par défaut :
    *   `super_admin` → `/super`
    *   `director` → `/` (dashboard principal)
    *   `teacher` → `/grades`
    *   `secretary` → `/students`
    *   `parent` / `student` → `/forbidden` (accès refusé à l'admin)

### 6. Protection anti cross-tenant dans `getAdminTenant()` (`apps/admin/src/lib/admin-tenant.ts`)
Modifier la fonction existante pour récupérer le profil de l'utilisateur connecté via `getCurrentProfile()` et lever une redirection vers `/forbidden` si `profile.role !== 'super_admin' && profile.organization_id !== organization.id`.

### 7. Page Post-Login (`apps/admin/src/app/post-login/page.tsx`)
Créer un composant minimal qui s'exécute côté serveur pour charger le profil et rediriger instantanément vers la bonne route à l'aide de `redirectByRole()`.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  Plus aucun mot de passe ou email de test n'est écrit en dur dans le code source de l'application admin.
2.  Tenter d'accéder à `/admin` ou tout autre sous-dossier sans être authentifié redirige automatiquement vers `/login`.
3.  La saisie d'un compte de test valide (directeur@strelitzia.test) authentifie l'utilisateur et le redirige vers le dashboard.
4.  L'authentification Google ou Magic Link fonctionne et crée correctement la session via la route de callback.
5.  **Test d'isolation** : Si un compte rattaché à l'école `STRELITZIA` tente d'accéder à l'adresse `uaz.edusmart.site/admin`, il doit être redirigé vers `/forbidden`.
