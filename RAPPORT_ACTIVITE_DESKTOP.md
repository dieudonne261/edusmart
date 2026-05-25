# Rapport d'activite - Desktop Electron

Date: 2026-05-24

## Contexte analyse

Le projet EduSmart est un monorepo Turborepo/pnpm avec 6 applications:
`vitrine`, `admin`, `mobile`, `kids`, `desktop` et `test`, plus les packages
`shared` et `ui`.

Les fichiers Markdown analyses indiquent que l'objectif est une plateforme
scolaire multi-etablissements, avec sous-domaines par ecole, Supabase,
Next.js, Expo et une application desktop Electron pour le secretariat/offline.

## Probleme Electron identifie

L'application desktop utilisait Vite sans configuration `base`. En build de
production, Vite peut generer des chemins d'assets absolus. Dans Electron,
quand `dist/index.html` est ouvert avec `loadFile`, ces chemins peuvent causer
une fenetre blanche.

Correction appliquee:

- ajout de `base: './'` dans `apps/desktop/vite.config.ts`
- desactivation de `signAndEditExecutable` pour eviter l'erreur Windows de
  liens symboliques pendant le packaging local Electron
- ajout d'un script `ensure:electron` pour reparer automatiquement le binaire
  Electron si `path.txt` ou `electron.exe` manque apres une installation
- port Vite fixe avec `strictPort` pour eviter qu'Electron attende `5173`
  pendant que Vite part sur `5174`

## UI ajoutee

L'ancien ecran desktop etait un simple texte statique. Il a ete remplace par un
dashboard de secretariat plus utile et plus proche d'une interface shadcn:

- sidebar de navigation
- header avec actions
- switch mode clair/sombre
- cartes de statistiques
- badges d'etat
- onglets simples
- file de taches mockee
- tableau d'eleves mocke
- zone vide pour la future synchronisation offline

Les donnees ajoutees restent du mock data local. Aucune logique metier backend
n'a ete modifiee.

## Design

Choix respectes:

- pas de gradient
- coins moderes avec `rounded-md`
- palette sobre et lisible
- composants simples et utiles
- theme light/dark via variables CSS
- micro-interactions avec transitions CSS

## Fichiers modifies

- `apps/desktop/vite.config.ts`
- `apps/desktop/package.json`
- `apps/desktop/src/App.tsx`
- `apps/desktop/src/styles.css`
- `RAPPORT_ACTIVITE_DESKTOP.md`

## Fichiers ajoutes

- `apps/desktop/tailwind.config.ts`
- `apps/desktop/postcss.config.mjs`
- `apps/desktop/scripts/ensure-electron.cjs`
- `RAPPORT_ACTIVITE_DESKTOP.md`

## Verifications effectuees

- type-check desktop: OK
- build Vite desktop: OK
- build Electron complet: OK
- verification binaire Electron local: OK (`v30.5.1`)
- test court `pnpm run dev`: OK, Electron se lance
- verification visuelle locale dans le navigateur integre: OK
- switch light/dark: OK
- recherche de `gradient` dans l'app desktop: OK, aucune occurrence
