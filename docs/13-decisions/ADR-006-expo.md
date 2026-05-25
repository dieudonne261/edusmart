# ADR-006 — Expo SDK 51 pour le mobile

**Statut** : ✅ Acté
**Date** : 2026-05-19
**Auteur** : Randrianarison Dieu Donné

## Contexte
2 applications mobiles iOS + Android : `mobile` (parents/élèves) et `kids` (enfants gamifié). Comment construire ?

## Options envisagées
- **A** : React Native CLI vanilla — flexibilité totale, mais setup natif lourd.
- **B** : Expo SDK 51 (managed workflow + Expo Router + EAS Build).
- **C** : Flutter — perf native, mais réécriture en Dart (équipe React).
- **D** : PWA installable — plus simple, mais pas de notifications iOS robustes, pas de stores.
- **E** : Capacitor + React — hybride, perf moindre que React Native.

## Décision
**Option B** : Expo SDK 51 (managed) + Expo Router (file-based comme Next.js).

## Conséquences
- ✅ **EAS Build cloud** : pas besoin de Mac pour build iOS.
- ✅ **OTA updates** via `expo-updates` : patcher sans review store.
- ✅ **Expo Router** : routing file-based identique à Next.js → faible courbe pour l'équipe.
- ✅ **Bibliothèques natives** prêtes (camera, secure-store, notifications, MMKV).
- ✅ **Hot reload** pour le dev.
- ✅ **Réutilisation `@edusmart/shared`** (TypeScript + Supabase) sans wrapper.
- ❌ **Bridging custom complexe** plus difficile que React Native CLI (cas rare).
- ❌ **Bundle plus gros** que React Native CLI (~10 MB initial).
- ❌ **Mise à jour Expo SDK majeure** demande migration (SDK 51 → 52 prévu fin 2026).

## Alternatives à revoir si...
- Besoin de module natif très spécifique non couvert par Expo → utiliser `expo-dev-client` puis `prebuild`.
- Build EAS devient payant à un volume non souhaité → migrer vers EAS self-hosted.
