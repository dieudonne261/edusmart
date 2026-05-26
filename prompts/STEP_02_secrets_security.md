# PROMPT CLAUDE — ÉTAPE 02 : Sécuriser les secrets (RÉFÉRENCE)

> ℹ️ **STATUT : DÉJÀ EXÉCUTÉ**  
> Ce prompt sert de référence historique pour l'audit de sécurité des clés et variables d'environnement.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/vitrine` : Next.js 14 (site public)
- `apps/admin` : Next.js 14 (portail administration)
- `apps/desktop` : Electron 30 + Vite + React (secrétariat offline)
- `apps/mobile` : Expo 51 (suivi parents/élèves)
- `apps/kids` : Expo 51 (app enfant gamifiée)
- `apps/test` : Next.js 14 (sandbox de déploiement)
- `packages/shared` : Types, DB helpers, client Supabase partagé
- `packages/ui` : Design tokens partagés

---

## 🎯 OBJECTIF DE L'ÉTAPE 02
S'assurer qu'aucun secret réel n'est commité dans le dépôt Git (JWT Supabase, clés Resend, OpenRouter, Twilio) et assainir `.env.example` en remplaçant toutes les valeurs réelles par des `<placeholders>`. Configurer les protections GitHub et mettre à jour la configuration Claude.

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

### 1. Audit et Nettoyage
*   Lancer des recherches Regex dans le code pour traquer d'éventuelles clés restées en clair :
    ```bash
    # Exemples de commandes d'audit :
    git grep -nE "eyJ[A-Za-z0-9_-]{20,}" -- '*.env*' '*.md' '*.json' '*.ts' '*.tsx'
    git grep -nE "re_[A-Za-z0-9]{20,}" -- '*.env*'
    git grep -nE "sk-or-v1-[A-Za-z0-9]{40,}" -- '*.env*'
    ```
*   Remplacer toutes les valeurs réelles présentes dans `.env.example` par des placeholders standardisés (ex: `<your-supabase-url>`).
*   Vérifier que `.gitignore` à la racine exclut bien tous les fichiers de secrets locaux :
    ```gitignore
    .env
    .env.local
    .env.*.local
    .env.production
    .env.development
    ```

### 2. Régénération des Secrets Compromis
Si une clé est trouvée dans l'historique Git :
*   La révoquer immédiatement dans le dashboard du fournisseur (Supabase, Resend, OpenRouter, Twilio).
*   Générer une nouvelle clé et la renseigner localement dans `.env` (non tracké par Git) et sur Vercel/GitHub Secrets.

### 3. Protections GitHub
*   Activer Dependabot et Dependabot Security updates.
*   Activer le **Secret Scanning** et la **Push Protection** dans les paramètres du repo GitHub pour interdire le push de commits contenant des secrets à l'avenir.

---

## ✅ CRITÈRES DE VALIDATION
1.  `git grep` ne retourne aucune clé réelle en clair.
2.  `.env` local n'est pas tracké par Git (`git ls-files \| grep -E "^\.env$"` est vide).
3.  `.env.example` contient uniquement des placeholders.
4.  Les variables d'environnement sont correctement propagées sur la plateforme Vercel pour le build.
