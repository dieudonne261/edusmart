# ADR-007 — Electron pour le desktop offline

**Statut** : ✅ Acté
**Date** : 2026-05-20
**Auteur** : Randrianarison Dieu Donné

## Contexte
Le secrétariat des écoles malgaches travaille souvent **sans connexion fiable**. L'app desktop doit fonctionner offline, saisir des notes, imprimer des bulletins, puis se synchroniser quand le réseau revient.

## Options envisagées
- **A** : Electron + React + Vite — stack web dans une fenêtre native.
- **B** : Tauri + React — plus léger (Rust + WebView OS), mais SQLite + impression moins matures.
- **C** : PWA installable + Service Worker — pas de SQLite robuste, impression limitée, iOS PWA très limité.
- **D** : App native Windows (.NET) — réécriture totale, pas de réutilisation de la stack web.

## Décision
**Option A** : Electron 30 + React + Vite + Tailwind.

## Conséquences
- ✅ **Réutilisation immédiate** de `@edusmart/shared` (TS + Supabase).
- ✅ **SQLite robuste** (better-sqlite3) → stockage offline fiable.
- ✅ **Impression native** via `webContents.print()` + `@react-pdf/renderer`.
- ✅ **Cross-platform** : Windows + macOS + Linux avec electron-builder.
- ✅ **Auto-update** via `electron-updater` (P3).
- ❌ **Bundle gros** (~150 MB installeur Windows) — acceptable pour secrétariat.
- ❌ **RAM consommée** (~250 MB idle) — acceptable sur PC bureau.
- ❌ **3 bugs spécifiques rencontrés** (déjà résolus, voir [BUGS_AND_FIXES](../12-bugs/BUGS_AND_FIXES.md) #4, #5, #6).

## Alternatives à revoir si...
- Tauri 2 mûrit sur les modules SQLite + impression → reconsidérer pour gain RAM/taille.
- Le besoin offline disparaît (rare) → migration vers PWA.
