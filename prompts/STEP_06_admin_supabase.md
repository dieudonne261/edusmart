# PROMPT CLAUDE — ÉTAPE 06 : Brancher l'admin sur Supabase (students, grades, settings)

> 🎯 **OBJECTIF** : Remplacer l'ensemble de la data mockée de l'administration (`apps/admin`) par des requêtes et actions Supabase. Mettre en œuvre le CRUD des élèves, la saisie des notes, la modification des paramètres de l'école (couleurs/logo) et l'alimentation dynamique du Dashboard KPI.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/admin` : Next.js 14 (portail administration)
- `packages/shared` : Types, DB helpers, client Supabase partagé (`@edusmart/shared`)
- `apps/admin/src/lib/admin-tenant.ts` : Helper `getAdminTenant()` (renvoie l'organisation et le profil connecté après validation anti cross-tenant).

L'authentification et l'isolation RLS sont déjà en place.

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

| Fichier | Action | Description |
|---|---|---|
| `apps/admin/src/app/page.tsx` | **Modifier** | Charger les statistiques réelles (KPIs) depuis Supabase. |
| `apps/admin/src/app/students/page.tsx` | **Modifier** | Affichage de la liste des élèves avec recherche textuelle et filtres par statut/classe. |
| `apps/admin/src/app/students/actions.ts` | **Créer** | Server Actions de création (`createStudent`), modification (`updateStudent`) et suppression (`deleteStudent`) d'un élève. |
| `apps/admin/src/app/students/[id]/page.tsx` | **Créer** | Page de détail d'un élève : fiche d'informations, historique d'inscriptions et historique complet de ses notes. |
| `apps/admin/src/app/grades/page.tsx` | **Modifier** | Grille de saisie interactive des notes par classe et par matière. |
| `apps/admin/src/app/grades/actions.ts` | **Créer** | Server Actions pour enregistrer une note (`recordGrade`) et importer des notes en lot (`bulkImportGrades`). |
| `apps/admin/src/app/settings/page.tsx` | **Modifier** | Formulaire de mise à jour des informations de l'établissement (nom, adresse, couleurs du thème). |
| `apps/admin/src/app/settings/actions.ts` | **Créer** | Server Actions pour modifier l'organisation et uploader le logo de l'école sur le bucket Supabase Storage `logos`. |
| `apps/admin/src/app/settings/vitrine/page.tsx` | **Créer** | Formulaire d'édition des métadonnées du site public de l'école (`vitrine_settings`). |

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez implémenter les fonctionnalités suivantes dans `apps/admin` :

### 1. Dashboard Dynamique (`apps/admin/src/app/page.tsx`)
Exécuter des requêtes parallélisées pour compter le nombre d'élèves, de notes ajoutées dans la semaine et d'élèves signalés en situation de vigilance (`status = 'watch'`) :
```typescript
import { getAdminTenant } from '@/lib/admin-tenant'
import { createSupabaseServerClient } from '@edusmart/shared'

export default async function Dashboard() {
  const { organization } = await getAdminTenant()
  const supabase = createSupabaseServerClient()
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: studentsCount },
    { count: gradesThisWeek },
    { count: studentsAtRisk },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('organization_id', organization.id),
    supabase.from('grades').select('*', { count: 'exact', head: true }).eq('organization_id', organization.id).gte('recorded_at', oneWeekAgo),
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('organization_id', organization.id).eq('status', 'watch'),
  ])

  // Retourner le composant UI avec les vrais chiffres
  return <DashboardKPI students={studentsCount ?? 0} grades={gradesThisWeek ?? 0} atRisk={studentsAtRisk ?? 0} />
}
```

### 2. CRUD Élèves avec validation Zod (`apps/admin/src/app/students/actions.ts`)
Créer un schéma de validation strict avec Zod pour valider les données de formulaire.
*   Générer un code élève unique (ex: `<SLUG>-<TIMESTAMP>`).
*   Utiliser `revalidatePath('/students')` pour actualiser la cache Next.js après modifications.

### 3. Upload de Logo vers le Bucket Supabase (`apps/admin/src/app/settings/actions.ts`)
Développer la Server Action d'upload du logo. Elle doit valider la taille et le format du fichier, le pousser dans le bucket `logos` de Supabase Storage en suivant le chemin `<organization_id>/logo-<timestamp>.png`, puis mettre à jour la colonne `logo_url` de la table `organizations`.
```typescript
import { getAdminTenant } from '@/lib/admin-tenant'
import { createSupabaseServerClient } from '@edusmart/shared'
import { revalidatePath } from 'next/cache'

export async function uploadLogo(formData: FormData) {
  const file = formData.get('logo') as File
  if (!file || file.size === 0) return { error: 'Fichier invalide' }
  if (file.size > 2 * 1024 * 1024) return { error: 'Fichier trop lourd (max 2 Mo)' }

  const { organization } = await getAdminTenant()
  const supabase = createSupabaseServerClient()
  const path = `${organization.id}/logo-${Date.now()}.png`

  const { error: upErr } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
  if (upErr) return { error: upErr.message }

  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)
  
  const { error: dbErr } = await supabase
    .from('organizations')
    .update({ logo_url: publicUrl })
    .eq('id', organization.id)

  if (dbErr) return { error: dbErr.message }

  revalidatePath('/settings')
  return { success: true, url: publicUrl }
}
```

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  Le Dashboard principal de l'administration n'affiche plus de valeurs codées en dur mais les totaux exacts issus de PostgreSQL.
2.  L'ajout d'un élève via le formulaire fonctionne, génère un code élève et apparaît instantanément dans la table des élèves.
3.  L'édition et la suppression d'un élève mettent bien à jour la base de données.
4.  La grille de saisie des notes permet d'enregistrer une note pour une matière et un élève donnés.
5.  Le changement des couleurs ou de l'image de logo de l'école dans les paramètres est persistant et se répercute sur l'ensemble de l'interface.
6.  Toutes les requêtes d'écriture sont soumises aux politiques RLS de Supabase et interdisent toute fuite/écriture cross-tenant.
