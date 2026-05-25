# STEP 15 — Déploiement production multi-école + migration edusmart.mg

> **Priorité** : 🟢 P3 (objectif final mémoire / pilote réel)
> **Estimation** : 10-14 heures + suivi pilote
> **Ordre** : après STEPS 06–14

## 🎯 Objectif

Mettre en service la plateforme pour 1 école pilote (STRELITZIA), mesurer les KPI, préparer la migration `edusmart.site` → `edusmart.mg`, soumettre les apps mobiles aux stores.

## 📦 Phases

### Phase A — Préparation pilote

| Item | Détail |
|---|---|
| Audit final sécurité | Voir [SECURITY_REPORT](../docs/14-security/SECURITY_REPORT.md) — tous les P0/P1 fermés |
| Backup Supabase | Dashboard → Backups → Create now |
| Pages légales | `/privacy`, `/terms`, `/cookies` publiées |
| Google OAuth | Passer en Production (sortir mode Testing) |
| Page status | `status.edusmart.site` (BetterStack ou statuspage.io) |
| Bannière "Beta" | sur l'admin pour gérer les attentes |

### Phase B — Import données STRELITZIA

```sql
-- Étapes manuelles :
-- 1. Récupérer le CSV des élèves auprès du secrétariat
-- 2. Convertir en INSERT SQL (ou via une route /admin/import)
-- 3. Vérifier RLS sur les inserts
-- 4. Tester sur 5 élèves avant import complet
```

Outil d'import CSV à créer dans `/admin/import` :
```tsx
// Upload .csv → Server Action parse → batch insert students avec validation zod
```

### Phase C — Formation utilisateurs

| Audience | Format | Durée |
|---|---|---|
| Directeur STRELITZIA | 1-to-1 visio + Loom | 1h |
| 3 enseignants pilote | Workshop groupe | 2h |
| 1 secrétaire | Hands-on bureau | 2h |
| Parents (~20 du pilote) | Tutoriel vidéo + onboarding in-app | autonome |

Livrables :
- [ ] Guide directeur PDF (créer dans `/docs/user-guide-director.md`)
- [ ] Vidéo Loom "Saisir une note en 30s"
- [ ] FAQ parents

### Phase D — Mesure KPI (4 semaines)

| KPI | Cible | Mesure |
|---|---|---|
| Temps moyen génération bulletins | -70 % | Avant : ~4h / classe. Après : <1h |
| Détection précoce décrochage | 80 % | Croiser alerts vs décrochages réels |
| Taux d'adoption parents | > 70 % | Parents ayant ouvert l'app au moins 2x/sem |
| Disponibilité plateforme | > 99 % | Status page |
| Nombre de bugs critiques remontés | < 5 | Issues GitHub label `bug-critical` |

Dashboard dédié dans `/admin/super/kpi` à créer.

### Phase E — Migration `edusmart.mg`

> **Quand** : après pilote validé (3 écoles + 100 utilisateurs actifs).

| Étape | Détail |
|---|---|
| 1. Acheter `edusmart.mg` | via registar MG (.mg coûte ~80 €/an) |
| 2. Configurer DNS chez registar | Mêmes records que LWS actuel |
| 3. Ajouter `edusmart.mg` + `*.edusmart.mg` dans Vercel | sans retirer `edusmart.site` |
| 4. Redirect 301 `edusmart.site/*` → `edusmart.mg/*` | dans `next.config.mjs` ou middleware |
| 5. Mettre à jour `NEXT_PUBLIC_ROOT_DOMAIN=edusmart.mg` | Vercel env vars |
| 6. Mettre à jour Supabase Auth Site URL | `https://edusmart.mg` |
| 7. Mettre à jour Resend SPF/DKIM pour `edusmart.mg` | DNS records |
| 8. Communiquer la migration aux écoles | Email + bannière 1 mois |
| 9. Garder `edusmart.site` actif 1 an minimum (redirects) | éviter les liens cassés |

### Phase F — Soumission App Stores

| Step | iOS | Android |
|---|---|---|
| Apple Developer / Google Play | 99 €/an | 25 € one-time |
| Préparer screenshots (5 formats iOS, 8 Android) | manuel ou Figma + Fastlane | idem |
| Politique de confidentialité URL | `edusmart.mg/privacy` | idem |
| Build production EAS | `eas build --platform ios --profile production` | `--platform android` |
| Soumission | `eas submit --platform ios --latest` | `eas submit --platform android` |
| Review | ~5-7 jours | ~24-48h |
| Réponse aux refus | itérer | itérer |

### Phase G — Post-launch monitoring

- Activer Vercel Speed Insights production.
- Sentry — créer un projet par app (admin, vitrine, mobile, kids).
- Dashboard BetterStack ou statuspage.io publié.
- Astreinte 24/7 super_admin (au moins WhatsApp) pendant le 1er mois.

## ✅ Validation finale

- [ ] STRELITZIA utilise EduSmart au quotidien depuis 4 semaines.
- [ ] KPI mesurés et conformes aux cibles (70 % temps bulletins, 80 % détection).
- [ ] Apps iOS + Android publiées dans les stores.
- [ ] `edusmart.mg` opérationnel.
- [ ] 0 incident critique non résolu.
- [ ] Mémoire de Master soutenu avec démo live.

## 🏁 Fin de roadmap initiale

Après ce STEP, la plateforme est en production réelle. Itérations suivantes :
- Onboarding de 2-3 écoles supplémentaires.
- Modèle économique B2B (abonnement Stripe).
- 2FA TOTP super_admin / director.
- Internationalisation (mg-MG, anglais).
- Module finances (paiements scolarité, suivi inscriptions).

## ➡️ Liens

- 🚀 [DEPLOYMENT](../docs/09-deployment/DEPLOYMENT.md)
- 🛡️ [SECURITY_REPORT](../docs/14-security/SECURITY_REPORT.md)
- 🗺️ [ROADMAP](../docs/10-roadmap/ROADMAP.md)
- 📘 [FINAL_ANALYSIS_REPORT](../docs/FINAL_ANALYSIS_REPORT.md)
