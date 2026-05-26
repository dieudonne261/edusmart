# PROMPT CLAUDE — ÉTAPE 09 : App kids (login QR/PIN + mini-jeux)

> 🎯 **OBJECTIF** : Développer l'application mobile ludo-éducative `apps/kids` (Expo SDK 51) destinée aux enfants de 6 à 14 ans. Elle doit supporter un système de connexion simplifié (QR Code généré par l'école ou couple Code élève + code PIN à 4 chiffres) et intégrer 4 à 5 mini-jeux éducatifs synchronisés avec Supabase.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/kids` : Expo 51 (React Native) — Application enfants
- `packages/shared` : Types et clients Supabase
- `apps/admin` : Générateur de QR Code pour les enfants (par les enseignants)

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER DANS `apps/kids/`)

```
apps/kids/
├── package.json
├── app.json
├── app/
│   ├── _layout.tsx
│   ├── (auth)/
│   │   ├── login.tsx            ← Choix du mode de connexion (QR, Code + PIN, Google)
│   │   └── qr-scanner.tsx       ← Caméra pour scanner le QR Code et appeler l'API de connexion
│   └── (game)/
│       ├── _layout.tsx
│       ├── home.tsx            ← Tableau de bord : Choix du mini-jeu ou du quiz publié par l'école
│       └── play/[quizId].tsx   ← Écran de jeu interactif
├── components/
│   ├── QCMGame.tsx             ← Mini-jeu de questions à choix multiples (QCM)
│   ├── DragDropGame.tsx        ← Mini-jeu d'association par glisser-déposer
│   ├── MemoryGame.tsx          ← Mini-jeu de cartes à retourner (mémorisation)
│   ├── ScoreScreen.tsx         ← Écran final avec animations et résumé des scores
│   └── CharacterAvatar.tsx     ← Avatar ludique de l'enfant qui réagit aux réussites/erreurs
├── lib/
│   ├── supabase.ts             ← Client Supabase partagé
│   └── mmkv-storage.ts         ← Cache local ultra-rapide avec react-native-mmkv pour l'accès hors-ligne
└── assets/
    └── sounds/                 ← Sons d'effet (réussite, erreur, complétude)
```

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez implémenter les fonctionnalités suivantes dans `apps/kids` :

### 1. Installer les Dépendances Spécifiques
```bash
cd apps/kids
npx expo install expo-camera expo-haptics expo-av expo-router expo-linking expo-constants
pnpm add react-native-mmkv react-native-svg react-native-reanimated
pnpm add @supabase/supabase-js react-native-url-polyfill
```

### 2. Implémenter le Flux de Connexion Simplifié
Les enfants ne devant pas manipuler d'adresses email complexes :
*   **Mode QR Code** : L'enseignant génère sur l'admin un QR Code contenant un token d'invitation signé (`JWT` contenant le `student_code` et `organization_id`). L'application scanne le code à l'aide d'un composant `CameraView` d'Expo, appelle l'API d'authentification et passe la session au client Supabase.
*   **Mode PIN** : Connexion à l'aide du code élève (ex: `STR-042`) et d'un code PIN à 4 chiffres (comparé côté serveur via un hash bcrypt).

### 3. Développer les Mini-Jeux Pédagogiques
*   **QCMGame** : 10 questions rapides. Utiliser `expo-haptics` pour faire vibrer le téléphone selon la justesse de la réponse (success/error) et jouer des sons gérés par `expo-av`.
*   **MemoryGame** : Jeu d'association de cartes (ex : formules mathématiques, traductions de mots, etc.).

### 4. Synchronisation des Quiz (Realtime + MMKV Cache)
*   Mettre en place une souscription Supabase Realtime dans `home.tsx` pour écouter les modifications de la table `quizzes` filtrées par l'ID de l'école.
*   Enregistrer les quiz publiés dans le cache local `MMKV` pour permettre aux enfants de jouer même sans réseau (mode hors-ligne).

### 5. Remonter les scores dans Supabase
À la fin de chaque partie, enregistrer les résultats (score final, temps passé, réponses détaillées) dans la table `game_scores` de Supabase. Si l'appareil est hors-ligne, stocker le score dans la queue locale et le pousser automatiquement lors du retour du réseau.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  L'application démarre et affiche un écran d'accueil coloré et engageant pour les enfants.
2.  Scanner un QR Code d'invitation valide ouvre instantanément la session de l'élève correspondant sans aucune saisie.
3.  Le mini-jeu QCM fonctionne, vibre à la sélection d'une réponse et joue les effets sonores configurés.
4.  Les scores obtenus par l'enfant s'enregistrent dans la table `game_scores` de Supabase.
5.  Les quiz modifiés côté administration (Supabase) sont mis à jour en temps réel sur l'application des élèves connectés en Wi-Fi.
