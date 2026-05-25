# ADR-004 — Multi-tenancy par sous-domaine

**Statut** : ✅ Acté
**Date** : 2026-05-19
**Auteur** : Randrianarison Dieu Donné

## Contexte
EduSmart hébergera N écoles avec **un seul code et un seul déploiement**. Comment identifier l'école active pour chaque requête ?

## Options envisagées
- **A** : Sous-domaine → `strelitzia.edusmart.site`, `uaz.edusmart.site`.
- **B** : Path-based → `edusmart.site/strelitzia/...`, `edusmart.site/uaz/...`.
- **C** : Query param → `edusmart.site/?school=strelitzia`.
- **D** : Sous-dossier par école avec rewrite Vercel.

## Décision
**Option A** : Sous-domaine `<slug>.edusmart.site` (avec wildcard CNAME Vercel).
**Fallback local** : query param `?school=<slug>` (option C) pour le dev.

## Conséquences
- ✅ **URL professionnelle** : "strelitzia.edusmart.site" vs "edusmart.site/strelitzia".
- ✅ **Cookies isolés** par sous-domaine (sessions distinctes possibles).
- ✅ **SEO meilleur** : chaque école = un "site" distinct pour Google.
- ✅ **Branding fort** : l'école se perçoit comme propriétaire de son domaine.
- ✅ **Compatible wildcard SSL Vercel** : 1 cert pour tous les sous-domaines.
- ✅ **Compatible Resend / Supabase** (Site URL = root).
- ❌ Setup DNS plus complexe (wildcard CNAME LWS).
- ❌ En local : nécessite `?school=` ou `/etc/hosts` (choix : query param car plus simple).
- ❌ Middleware doit parser le Host correctement (1 fonction utilitaire).
- ❌ Pas de wildcard cookie cross-subdomain par défaut (à configurer si shared session).

## Alternatives à revoir si...
- Le DNS LWS devient trop limitant → bouger les NS vers Cloudflare.
- Besoin de WhiteLabel complet → mettre à dispo `edusmart.site/abc` ET le domaine custom de l'école.
