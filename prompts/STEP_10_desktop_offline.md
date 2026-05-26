# PROMPT CLAUDE — ÉTAPE 10 : Sync offline desktop (IPC + SQLite + worker 5 min)

> 🎯 **OBJECTIF** : Rendre l'application bureau de secrétariat (`apps/desktop`) pleinement fonctionnelle en mode hors-ligne. Cela implique de configurer une base de données locale SQLite (better-sqlite3) servant de miroir à Supabase, de définir le canal IPC pour la communication entre le processus principal et le renderer, et d'implémenter un worker de synchronisation bidirectionnelle automatique (toutes les 5 minutes).

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/desktop` : Electron 30 + Vite + React — Application bureau
- `packages/shared` : Contient le client et les types (utilisé ici pour référence logique)

L'application bureau dispose déjà de son interface utilisateur mais celle-ci n'affiche que des données statiques.

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER DANS `apps/desktop/`)

```
apps/desktop/
├── package.json                  ← Ajouter better-sqlite3 et electron-store
├── electron/
│   ├── main.cjs                  ← Initialiser la base SQLite et charger les fichiers IPC
│   ├── preload.cjs               ← Exposer l'API typée au renderer avec contextBridge
│   ├── db/
│   │   └── schema.sql            ← Définition des tables SQLite locales (students, grades)
│   └── ipc/
│       ├── auth.cjs              ← Gestion de la session locale / distante
│       ├── db.cjs                ← Lecture/écriture locale dans SQLite
│       └── sync.cjs              ← Worker de synchronisation bidirectionnelle (pull/push)
└── src/
    ├── lib/
    │   └── ipc.ts                ← Wrappers TypeScript pour appeler window.api.*
    └── components/
        ├── SyncIndicator.tsx     ← Indicateur visuel d'état réseau et file d'attente de synchro
        └── PendingQueue.tsx      ← Liste des modifications locales en attente d'envoi
```

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez implémenter les étapes suivantes dans `apps/desktop` :

### 1. Installer les Dépendances Natives
Ajouter `better-sqlite3` et configurer la recompilation des modules natifs C++ d'Electron :
```bash
cd apps/desktop
pnpm add better-sqlite3 electron-store
pnpm add -D @types/better-sqlite3 electron-rebuild
# Recompiler le module better-sqlite3 pour la version exacte d'Electron 30
pnpm exec electron-rebuild
```

### 2. Définir le Schéma SQLite Miroir (`apps/desktop/electron/db/schema.sql`)
Créer les tables `students` et `grades` intégrant des colonnes de gestion de réplication :
*   `updated_at` (timestamp entier ms)
*   `pending_sync` (entier, vaut 1 si modifié localement, 0 sinon).

### 3. Exposer l'API Bridge dans `preload.cjs`
Utiliser `contextBridge.exposeInMainWorld('api', { ... })` pour exposer les canaux IPC sécurisés :
*   `api.auth.login(email, pwd)`
*   `api.db.studentsList()`
*   `api.db.gradesSave(data)`
*   `api.sync.tick()` / `api.sync.getPending()`

### 4. Développer le Worker de Synchronisation (`apps/desktop/electron/ipc/sync.cjs`)
Écrire la logique bidirectionnelle exécutée périodiquement (toutes les 5 minutes) et manuellement :
*   **PULL** : Interroger Supabase pour récupérer les enregistrements d'élèves dont le `updated_at` est supérieur à la dernière synchronisation locale et les insérer dans SQLite (`INSERT OR REPLACE`).
*   **PUSH** : Sélectionner les notes saisies localement ayant `pending_sync = 1`. Pour chaque note, l'envoyer sur Supabase via `.upsert()`. Si l'appel réussit, remettre `pending_sync = 0` dans la base SQLite locale.

### 5. Intégrer l'Indicateur Visuel (`apps/desktop/src/components/SyncIndicator.tsx`)
Créer un composant React qui écoute les événements `online` et `offline` du navigateur intégré pour afficher l'état réseau de l'application et rafraîchit périodiquement le nombre de requêtes en attente.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  L'application démarre correctement en local via `pnpm dev` et instancie le fichier de base de données SQLite `edusmart-local.db`.
2.  **Test hors-ligne** : Couper la connexion Wi-Fi (ou modifier l'état en offline) et saisir une note dans le dashboard admin bureau : la note s'enregistre localement dans SQLite avec la valeur `pending_sync = 1`.
3.  L'indicateur affiche : `⚠ Hors-ligne — 1 en attente`.
4.  **Test de reconnexion** : Rétablir le réseau : le worker de synchronisation s'exécute, pousse la note sur Supabase, et met à jour le statut SQLite local à `pending_sync = 0`.
5.  Les conflits de mise à jour (conflit de modification local vs distant) sont résolus par la comparaison de la colonne `updated_at`.
