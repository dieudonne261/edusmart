# ADR-003 — Supabase comme backend tout-en-un

**Statut** : ✅ Acté
**Date** : 2026-05-17
**Auteur** : Randrianarison Dieu Donné

## Contexte
EduSmart a besoin de : base de données relationnelle, authentification multi-rôles, sécurité fine par tenant, realtime (notifications), storage de fichiers (logos, avatars, PDFs), fonctions serverless (cron). Quelle stack backend ?

## Options envisagées
- **A** : Custom Node.js + Express + PostgreSQL self-hosted — flexibilité totale, mais Devops lourd.
- **B** : Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions) — tout-en-un managed.
- **C** : Firebase — NoSQL, vendor lock-in fort, moins adapté aux données relationnelles (notes, classes, etc.).
- **D** : AWS (Amplify ou Cognito + RDS + S3) — puissant mais coûteux et complexe.
- **E** : NHost — équivalent Supabase mais moins populaire, écosystème plus petit.

## Décision
**Option B** : Supabase.

## Conséquences
- ✅ PostgreSQL relationnel → idéal pour le modèle scolaire (élèves, notes, classes).
- ✅ **RLS Postgres natif** → isolation tenant garantie au niveau DB, pas applicatif.
- ✅ Auth multi-providers (Email, Magic Link, Google OAuth) gratuite.
- ✅ Realtime intégré → notifications push parents sans infra dédiée.
- ✅ Storage S3-compatible inclus → logos, avatars, PDFs bulletins.
- ✅ Edge Functions Deno → cron + webhooks sans serveur tiers.
- ✅ Free tier généreux (500 MB DB, 50k MAU, 5 GB bandwidth).
- ❌ Vendor lock-in modéré (PostgreSQL est portable, mais Auth + RLS spécifiques).
- ❌ Région la plus proche de Madagascar = Singapore (~80 ms latence).
- ❌ Quotas Free atteints rapidement si plusieurs grosses écoles → passer Pro à $25/mois.

## Alternatives à revoir si...
- Plus de 100k MAU → Pro (25 $/mois) puis Team (599 $/mois) coûteux → évaluer self-hosting Supabase ou alternative.
- Besoin de OLAP / BigQuery → décharger les analytics sur ClickHouse / Snowflake.
- Latence Singapore problématique → CDN edge functions ou hosting Afrique (rare).
