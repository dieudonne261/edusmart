# PROMPT CLAUDE — ÉTAPE 01 : Créer le schéma Supabase complet (RÉFÉRENCE)

> ℹ️ **STATUT : DÉJÀ EXÉCUTÉ**  
> Ce prompt sert de référence historique ou pour reconstruire / réinitialiser la base de données Supabase si nécessaire.

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

## 🎯 OBJECTIF DE L'ÉTAPE 01
Créer ou réinitialiser le schéma de base de données de l'application sur Supabase avec :
*   Le nettoyage des tables obsolètes.
*   La création des 30 tables réparties par domaine (Core, Référentiels, Structure, Élèves, Pédagogie, Communication, Finance, Bulletins, Contenu, IA, Système).
*   L'activation de la RLS (Row-Level Security) sur toutes les tables pour garantir le cloisonnement multi-tenant (par `organization_id`).
*   La création de 5 Buckets de stockage (logos, avatars, class_covers, news_covers, bulletins).
*   Le seed de données de démonstration pour deux écoles fictives (`STRELITZIA` à Toamasina et `UAZ` à Antsirabe).

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

### 1. Script SQL de création des tables et fonctions
Exécuter le script SQL présent dans `tasks/STEP_01.md` dans l'éditeur de requêtes SQL de Supabase (SQL Editor → New query). Ce script effectue :
*   Le `DROP TABLE IF EXISTS` en cascade de la structure existante.
*   La création des extensions PG nécessaires (`uuid-ossp`, `pgcrypto`, `citext`).
*   La définition des fonctions utilitaires de gestion de session RLS (`current_user_organization_id()`, `current_user_role()`, `is_super_admin()`, `is_staff()`, `is_parent_of()`).
*   La création des 30 tables avec triggers `updated_at`.
*   La création des index de performance sur les clés étrangères.

### 2. Script SQL d'activation RLS
Appliquer le second bloc SQL d'activation de la RLS et de création des policies de sécurité présent dans `tasks/STEP_01.md`. Les politiques garantissent que :
*   Les élèves/parents ne peuvent lire que les données de leur établissement.
*   Les enseignants et directeurs ont un accès complet en lecture/écriture aux données liées à leur `organization_id`.
*   Les administrateurs système (`super_admin`) bypassent les restrictions RLS.

### 3. Création des buckets de stockage
Dans l'interface Supabase Storage, créer les buckets suivants avec politique publique en lecture seule :
*   `logos` : Logos des écoles
*   `avatars` : Photos de profil
*   `class_covers` : Images d'illustration des classes
*   `news_covers` : Images d'illustration des actualités
*   `bulletins` : PDF des bulletins de notes (bucket privé, accès via liens signés)

### 4. Seed des données de test
Exécuter le troisième bloc SQL contenant les inserts de données de test présent dans `tasks/STEP_01.md` pour alimenter la base de données.

---

## ✅ CRITÈRES DE VALIDATION
1.  Les tables apparaissent dans le schéma public de la base de données de Supabase.
2.  La RLS est activée (`Enabled`) sur l'ensemble des tables.
3.  Les buckets de stockage sont créés avec les bons droits d'accès.
4.  Les données de seed sont visibles dans l'interface table editor de Supabase.
