# PROMPT CLAUDE — ÉTAPE 08 : Démarrer l'app mobile (login + tabs + écran notes)

> 🎯 **OBJECTIF** : Mettre en place le squelette applicatif et les fonctionnalités clés de l'application mobile parents/élèves (`apps/mobile`) sous Expo SDK 51, incluant la persistance de l'auth Supabase via SecureStore, le routage par onglets (Expo Router) et l'affichage des notes.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/mobile` : Expo 51 (React Native) — Application mobile
- `packages/shared` : Contient le client et les types (utilisé ici pour référence logique)

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER DANS `apps/mobile/`)

```
apps/mobile/
├── package.json
├── app.json
├── lib/
│   ├── supabase.ts              ← Client Supabase configuré avec l'adaptateur de stockage sécurisé Expo
│   └── auth-context.tsx         ← Fournisseur de contexte global pour l'état de session utilisateur
├── app/
│   ├── _layout.tsx              ← Point d'entrée de l'application (chargeurs de polices, providers)
│   ├── (auth)/
│   │   ├── login.tsx            ← Formulaire de login email/password et demande de Magic Link
│   │   └── magic-link-sent.tsx  ← Écran informant de l'envoi du Magic Link
│   └── (tabs)/
│       ├── _layout.tsx          ← Configuration de la barre d'onglets inférieure (Bottom Tabs)
│       ├── index.tsx            ← Onglet Principal : Liste des notes de l'élève + graphique de progression
│       ├── homework.tsx         ← Onglet Devoirs : Liste des devoirs triés par date de rendu
│       ├── messages.tsx         ← Onglet Messages : Liste des discussions internes
│       └── profile.tsx          ← Onglet Profil : Informations personnelles et bouton de déconnexion
└── components/
    ├── GradesChart.tsx          ← Graphique d'évolution des notes (victory-native ou react-native-chart-kit)
    └── GradesList.tsx           ← Liste détaillée des évaluations avec coefficients
```

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez exécuter les étapes suivantes dans `apps/mobile` :

### 1. Installer les Dépendances Mobiles
Se placer dans le répertoire de l'application mobile et installer les paquets requis pour l'authentification sécurisée, la navigation et les graphiques :
```bash
cd apps/mobile
npx expo install expo-router expo-secure-store expo-linking expo-constants expo-device
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens
pnpm add @supabase/supabase-js react-native-url-polyfill
pnpm add react-native-chart-kit react-native-svg  # Pour les graphiques
```

### 2. Configurer le Client Supabase Mobile (`apps/mobile/lib/supabase.ts`)
Créer un client Supabase qui enregistre la session utilisateur dans le stockage sécurisé du système d'exploitation mobile (`expo-secure-store`) :
```typescript
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // géré manuellement via deep linking
    },
  },
)
```

### 3. Créer le Provider d'Authentification (`apps/mobile/lib/auth-context.tsx`)
Créer un contexte React `AuthContext` exposant la session en cours, l'utilisateur et le profil complet (chargé depuis la table `profiles` de Supabase).

### 4. Gérer le Routage avec Expo Router (`apps/app/`)
*   `_layout.tsx` : Charger la session et afficher l'arbre `(auth)` si non connecté, ou `(tabs)` si connecté.
*   `(auth)/login.tsx` : Permettre la connexion par mot de passe ou l'envoi de Magic Link.
*   `(tabs)/_layout.tsx` : Configurer les 4 onglets avec des icônes explicites.
*   `(tabs)/index.tsx` : Charger les notes de l'élève connecté (ou de l'enfant de l'utilisateur s'il s'agit d'un parent) via Supabase et dessiner une courbe d'évolution avec `react-native-chart-kit`.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  L'application démarre sans erreur en mode développement (`npx expo start` ou `pnpm dev` depuis la racine mobile).
2.  Un utilisateur non authentifié est bloqué sur l'écran `/login`.
3.  La connexion email/password d'un parent ou d'un élève valide la session et affiche l'onglet des notes.
4.  L'isolation RLS s'applique : l'utilisateur ne voit que les notes de sa propre fiche élève (ou de ses enfants), aucune donnée d'une autre école ou d'un autre élève ne fuite.
5.  Fermer l'application (kill process) et la rouvrir ne demande pas de se reconnecter (la session est bien restaurée depuis le SecureStore).
6.  Le graphique de progression affiche correctement l'historique des moyennes.
