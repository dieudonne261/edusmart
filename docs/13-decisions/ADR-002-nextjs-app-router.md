# ADR-002 — Next.js 14 App Router pour le web

**Statut** : ✅ Acté
**Date** : 2026-05-16
**Auteur** : Randrianarison Dieu Donné

## Contexte
3 applications web : vitrine (marketing + portail familles), admin (gestion école), test (sandbox). Quel framework ?

## Options envisagées
- **A** : Next.js 14 Pages Router — stable, beaucoup d'exemples.
- **B** : Next.js 14 App Router — RSC + Server Actions + middleware natif.
- **C** : Vite + React SPA — plus simple, mais pas de SSR, pas de middleware Edge.
- **D** : Remix — middleware nest, mais écosystème plus petit.
- **E** : SvelteKit / Astro — plus rapides mais réécriture nécessaire de l'écosystème React.

## Décision
**Option B** : Next.js 14 App Router.

## Conséquences
- ✅ Server Components → moins de JS au client → meilleur LCP.
- ✅ Server Actions → mutations sans API REST custom.
- ✅ Middleware Edge natif → multi-tenancy par sous-domaine sans fonction Lambda séparée.
- ✅ Streaming + Suspense pour les pages lourdes (dashboard).
- ✅ ISR pour les pages publiques.
- ✅ Déploiement Vercel zero-config.
- ❌ App Router est plus jeune que Pages Router → quelques edge cases (ex: `cookies()` Routes Handlers).
- ❌ Next 15 sort bientôt avec changements → décider quand migrer.

## Alternatives à revoir si...
- Vercel rend leur plateforme payante prohibitive → migration possible vers Cloudflare Pages + OpenNext.
- Performance LCP insuffisante → étudier Astro pour la vitrine seule.
