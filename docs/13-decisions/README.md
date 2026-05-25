# ADRs — EduSmart

> Architecture Decision Records. Une décision = un fichier court. Lecture rapide.

| # | Titre | Statut |
|---|---|---|
| [ADR-001](ADR-001-monorepo.md) | Monorepo Turborepo + pnpm | ✅ Acté |
| [ADR-002](ADR-002-nextjs-app-router.md) | Next.js 14 App Router pour le web | ✅ Acté |
| [ADR-003](ADR-003-supabase.md) | Supabase comme backend tout-en-un | ✅ Acté |
| [ADR-004](ADR-004-multi-tenancy.md) | Multi-tenancy par sous-domaine | ✅ Acté |
| [ADR-005](ADR-005-openrouter.md) | OpenRouter pour les appels IA | ✅ Acté |
| [ADR-006](ADR-006-expo.md) | Expo SDK 51 pour le mobile | ✅ Acté |
| [ADR-007](ADR-007-electron.md) | Electron pour le desktop offline | ✅ Acté |
| [ADR-008](ADR-008-google-oauth-unique.md) | 1 seul credential Google OAuth | ✅ Acté |
| [ADR-009](ADR-009-vercel.md) | Vercel pour l'hébergement web | ✅ Acté |
| [ADR-010](ADR-010-dns-lws.md) | DNS LWS conservé (NS21..24) | ✅ Acté |

## Template ADR

```markdown
# ADR-NNN — <titre>

**Statut** : Proposé / Acté / Déprécié / Remplacé par ADR-XXX
**Date** : YYYY-MM-DD
**Auteur** : Nom

## Contexte
Quoi, pourquoi cette décision se pose.

## Options envisagées
- A : ...
- B : ...
- C : ...

## Décision
Option B retenue.

## Conséquences
- Positives : ...
- Négatives : ...
- Neutres : ...

## Alternatives à revoir si...
Conditions qui pourraient pousser à reconsidérer.
```
