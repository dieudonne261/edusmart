# ADR-001 — Monorepo Turborepo + pnpm

**Statut** : ✅ Acté
**Date** : 2026-05-16
**Auteur** : Randrianarison Dieu Donné

## Contexte
EduSmart se compose de 6 applications (admin, vitrine, desktop, mobile, kids, test) et de logique partagée (types, client Supabase, utils). Comment organiser le code ?

## Options envisagées
- **A** : Multi-repos — 1 repo par app + 1 repo `shared` publié sur npm privé.
- **B** : Monorepo Lerna + npm — vétéran, beaucoup de friction (lock files, hoisting).
- **C** : Monorepo Turborepo + pnpm — workspaces natifs, cache builds, vitesse.
- **D** : Monorepo Nx — puissant mais opinionated, courbe d'apprentissage plus forte.

## Décision
**Option C** : Turborepo 2 + pnpm 9 workspaces.

## Conséquences
- ✅ Code partagé (`@edusmart/shared`, `@edusmart/ui`) sans publication npm.
- ✅ Cache build local + remote (Vercel + Turborepo Cloud) → CI rapide.
- ✅ pnpm économise l'espace disque vs npm (hardlinks vers store global).
- ✅ Une seule install (`pnpm install`) couvre tout le monorepo.
- ❌ Toutes les apps dans un seul repo → conflits git plus probables avec une équipe.
- ❌ Vercel doit comprendre la structure monorepo (1 projet par app).

## Alternatives à revoir si...
- L'équipe dépasse 8-10 devs → étudier `nx` pour ses generators.
- Une app devient indépendante stratégiquement → extraire dans son propre repo.
