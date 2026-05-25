# ADR-009 — Vercel pour l'hébergement web

**Statut** : ✅ Acté
**Date** : 2026-05-17
**Auteur** : Randrianarison Dieu Donné

## Contexte
3 apps Next.js (vitrine, admin, test) à héberger. Quelle plateforme ?

## Options envisagées
- **A** : Vercel — créateurs de Next.js, intégration optimale.
- **B** : Netlify — équivalent, mais moins optimisé pour Next 14 App Router.
- **C** : Cloudflare Pages + OpenNext — gratuit, edge perf, mais maturity moindre.
- **D** : Self-host Node + nginx — flexibilité totale, devops lourd.

## Décision
**Option A** : Vercel.

## Conséquences
- ✅ **Build zero-config** pour Next.js App Router.
- ✅ **Wildcard `*.edusmart.site` natif** (essentiel pour multi-tenancy).
- ✅ **Preview deploys** automatiques sur chaque PR.
- ✅ **Edge Functions / Middleware** déployés mondialement.
- ✅ **Vercel Analytics + Speed Insights** intégrés (RUM gratuit limité).
- ✅ **Free tier** suffisant : 100 GB bandwidth/mois, build minutes illimités.
- ❌ **Vendor lock-in modéré** (Edge Runtime spécifique, mais portable).
- ❌ **Coût explose** à très haut trafic (1 TB+/mois → quelques centaines $/mois).
- ❌ **Free tier limites** : 12 deployments/jour, 100 GB-h serverless.

## Alternatives à revoir si...
- Trafic > 1 TB/mois → étudier Cloudflare + OpenNext.
- Politique Vercel change drastiquement → migration possible vers self-host (Next standalone export).
