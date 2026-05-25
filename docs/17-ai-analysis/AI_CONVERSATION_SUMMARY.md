# AI CONVERSATION SUMMARY — EduSmart

> Synthèse exécutive des 8 exports de conversation Claude qui ont guidé le projet.
> Période couverte : **2026-05-16 → 2026-05-25** (~10 jours intensifs).
> Documents sources (à archiver dans `docs/17-ai-analysis/_exports/`) :
>
> - `prompt_monorepo_edusmart.md` (2026-05-16)
> - `Export généré.md` (2026-05-17/18)
> - `Export_Conversation_EduSmart 1.md` (2026-05-18)
> - `Export_Conversation_EduSmart 2.md` (2026-05-20)
> - `EduSmart_VibeCoding_Guide.md` (2026-05-19)
> - `Export V3 Final généré.md` (2026-05-19/25) — **canonique le plus à jour**
> - `RAPPORT_ACTIVITE_DESKTOP.md` (2026-05-24)
> - `2026-05-25___backup_zone_edusmart.site.txt` (2026-05-25)

---

## 1. Pourquoi cette synthèse existe

Le lien de discussion partagé (`claude.ai/share/f4c64682-...`) **n'est pas accessible** sans authentification Claude.ai. Les 8 documents locaux ci-dessus contiennent toute l'information utile et représentent collectivement **~260 KB** de conversations.

Cette page consolide ce contenu, **sans duplication**, et marque les **évolutions de pensée** entre les versions.

---

## 2. Vision projet — itérations

| Version | Période | Périmètre |
|---|---|---|
| V0 (prompt initial) | 2026-05-16 | Monorepo basique 6 apps, école STRELITZIA seule, EduSmart Toamasina |
| V1 | 2026-05-17/18 | Élargissement multi-école implicite, intégration Supabase + OpenRouter posée |
| V2 | 2026-05-19/20 | Refonte vitrine : dual-mode `edusmart.site` (B2B directeurs) / `<slug>.edusmart.site` (B2C familles) |
| V3 Final | 2026-05-25 | **Multi-tenant 100 %**, 35 tâches sur 5 semaines, 10 prompts Claude prêts à l'emploi |

---

## 3. Décisions techniques majeures (consolidées)

> Détails : [ADR 001–010](../13-decisions/).

| ADR | Décision | Pourquoi (résumé) |
|---|---|---|
| [001](../13-decisions/ADR-001-monorepo.md) | Monorepo Turborepo + pnpm | Code partagé, cache |
| [002](../13-decisions/ADR-002-nextjs-app-router.md) | Next.js 14 App Router | RSC + middleware natif |
| [003](../13-decisions/ADR-003-supabase.md) | Supabase | Tout-en-un, gratuit |
| [004](../13-decisions/ADR-004-multi-tenancy.md) | Multi-tenancy sous-domaine | URL pro, cookies isolés |
| [005](../13-decisions/ADR-005-openrouter.md) | OpenRouter pour l'IA | Multi-modèles, coûts |
| [006](../13-decisions/ADR-006-expo.md) | Expo mobile | EAS cloud, OTA |
| [007](../13-decisions/ADR-007-electron.md) | Electron desktop | Offline + impression |
| [008](../13-decisions/ADR-008-google-oauth-unique.md) | 1 Google OAuth pour toutes écoles | Évite duplication |
| [009](../13-decisions/ADR-009-vercel.md) | Vercel | Wildcard natif, previews |
| [010](../13-decisions/ADR-010-dns-lws.md) | DNS LWS conservé | Garder mail métier |

---

## 4. Roadmap originale (consolidée)

Voir [ROADMAP](../10-roadmap/ROADMAP.md) pour le détail des 35 tâches.

Résumé 5 semaines :
- **S1** Fondations (Supabase + shared + middleware)
- **S2** Vitrine + Auth
- **S3** Admin connecté
- **S4** IA + Mobile
- **S5** Kids + Desktop + Bulletins PDF

---

## 5. Tâches explicitement mentionnées (TODO listés)

Voir [TASKS_GLOBAL](../11-tasks/TASKS_GLOBAL.md) — extrait des 30+ TODOs identifiés :

- Créer projet Supabase (région Singapore)
- Coller les 3 clés dans `.env` + Vercel
- Exécuter le script SQL complet (organizations, ..., ai_conversations)
- Insérer données test STRELITZIA + UAZ
- Configurer Supabase Auth (Site URL, Redirects, SMTP Resend)
- Créer credentials Google OAuth (1 unique)
- Personnaliser 5 templates emails Supabase
- Créer route `/auth/callback`
- Rate limiting `/api/chat`
- Génération bulletins PDF
- Edge Function `on_school_approved`
- Migration future `edusmart.mg`

---

## 6. Bugs documentés (chronologie)

Voir [BUGS_AND_FIXES](../12-bugs/BUGS_AND_FIXES.md) — 7 bugs majeurs déjà résolus, dont :

1. CNAME Vercel renommé (`cname.vercel-dns.com` → unique par projet)
2. Wildcard CNAME interceptait `mail.*` → fix avec A explicite
3. Google OAuth popup affichait "supabase.co"
4. Electron fenêtre blanche en prod (`base: './'`)
5. Erreur symlinks Windows (`signAndEditExecutable: false`)
6. Vite port mismatch (`strictPort: true`)
7. Binaire Electron manquant (script auto-réparateur)

---

## 7. TODO implicites — choses commencées mais pas finies

- Modèle Claude Code dans `.claude/settings.json` (`claude-opus-4-5` obsolète)
- `packages/shared/src/mock-data.ts` untracked → décision de remplacer par Supabase reportée
- 5 fichiers d'export `.md` non commités à la racine
- CLAUDE.md racine et sous-CLAUDE.md jamais créés
- Algorithme `riskScore.ts` mentionné mais absent
- Rate limiting `/api/chat` "simple compteur en mémoire" mentionné, non implémenté
- Détection décrochage (cron hebdo) non démarrée
- Migration `edusmart.site → edusmart.mg` différée
- Google OAuth en Production différé (reste en Testing avec 3 testers)
- Tests automatisés (rien en place)
- Sentry, Vercel Analytics annoncés mais non configurés

---

## 8. Citations clés (10 extraits indispensables)

1. > *« `organization_id` unique par école. RLS Supabase garantit l'isolation physique. »*
   — **Export V3 Final, message 18**

2. > *« Une session = une tâche = un commit. ❌ MAUVAIS : "Fais toute la vitrine + le login + l'admin en une fois". ✅ BON : "Fais uniquement le middleware.ts. Test. Commit. Ensuite le layout.tsx." »*
   — **EduSmart_VibeCoding_Guide §7**

3. > *« Règle d'or : Code → Test local → Debug → OK → Push → Vercel déploie → Test production → OK → Phase suivante. »*
   — **Export V3 Final, message 56**

4. > *« TOUJOURS filtrer par organization_id dans les requêtes Supabase · JAMAIS de clé API dans le code (utiliser .env.local). »*
   — **EduSmart_VibeCoding_Guide §2**

5. > *« Un enregistrement explicite `A mail` gagne sur le wildcard `*`. Donc `mail.edusmart.site` → LWS, et tout le reste → Vercel. »*
   — **Export généré, message 56**

6. > *« edusmart.site → public = directeurs d'école, CTA "Inscrire mon école". strelitzia.edusmart.site → public = familles parents, CTA "Inscrire mon enfant". »*
   — **Export V3 Final, messages 51-52**

7. > *« L'application desktop utilisait Vite sans configuration `base`. En build de production, Vite peut générer des chemins d'assets absolus. Correction : `base: './'`. »*
   — **RAPPORT_ACTIVITE_DESKTOP.md**

8. > *« OAuth part de edusmart.site, pas du sous-domaine → 1 seul credential Google pour TOUTES les écoles. »*
   — **Export V3 Final, messages 61-62**

9. > *« Astuce locale : `localhost:3001?school=strelitzia` → données STRELITZIA en vert · `?school=uaz` → données UAZ en violet · `?school=xyz` → 404 »*
   — **Export V2, Phase 4 vitrine école**

10. > *« Impact attendu : 70 % réduction temps bulletins, 80 % détection décrochage 4 semaines avant examens. »*
    — **Export V3 Final, message 10**

---

## 9. Recommandations pour la suite

### Garder de la conversation
- Le principe **"1 session = 1 tâche = 1 commit"** est juste — l'appliquer strictement.
- La règle **"jamais de mock en prod"** doit guider la priorisation P0.
- Le pattern **"vérifier en local, vérifier en preview, puis seulement prod"** doit être enforced en CI.

### Ce qu'il faudra clarifier (si nouvelle conversation)
- **Modèle économique** : freemium ? B2B subscription ? Comment monétiser au-delà du mémoire ?
- **Tarif Supabase Pro** : à quel volume passer du Free au Pro ?
- **Stratégie Apple App Store** : compter le 99 €/an dans le budget ?
- **Plan de support** post-déploiement : qui répond aux directeurs ?

### Ce qu'il faut documenter en plus
- **Contrats légaux** : CGV B2B (vente à école), CGU élèves/parents, RGPD-light Madagascar.
- **Politique de pricing** : par école ? par utilisateur actif ? freemium ?
- **Plan de formation** : comment former un directeur en 1h à utiliser EduSmart ?

---

## 10. Liens

- 📘 [PROJECT_OVERVIEW](../01-overview/PROJECT_OVERVIEW.md)
- 🏗️ [ARCHITECTURE](../02-architecture/ARCHITECTURE.md)
- 📊 [CURRENT_STATE](../01-overview/CURRENT_STATE.md)
- 🗺️ [ROADMAP](../10-roadmap/ROADMAP.md)
- 🧠 [Décisions ADR](../13-decisions/)
- 🗂️ [MASTER_INDEX](../MASTER_INDEX.md)
