# SECURITY REPORT — EduSmart

> Audit de sécurité du repo au 2026-05-25. Score : **2/10** (critique — projet en phase de scaffolding sans aucune mesure de sécurité réelle).

---

## 1. Score global

| Dimension | Note /10 | Statut |
|---|:-:|---|
| Gestion des secrets | 2 | 🔴 Critique — clés probablement exposées dans `.env.example` |
| Authentification | 0 | 🔴 Critique — login hardcodé |
| Autorisation / RLS | 1 | 🔴 Pas de DB donc pas de RLS active |
| Validation des inputs | 3 | 🔴 Aucune validation côté server |
| Protection CSRF | 8 | 🟢 Server Actions Next.js OK |
| Protection XSS | 7 | 🟢 React échappe par défaut |
| HTTPS / TLS | 10 | ✅ Vercel + LWS forcent HTTPS |
| CSP / security headers | 3 | 🔴 Aucun header custom |
| Rate limiting | 0 | 🔴 Aucun |
| Logging / audit | 1 | 🔴 Aucun |
| Dependencies vulns | 7 | 🟢 Récentes versions installées (pas d'audit récent) |
| **Score moyen** | **3.8/10** | 🔴 **NE PAS METTRE EN PRODUCTION EN L'ÉTAT** |

---

## 2. Vulnérabilités critiques (P0)

### V-01 — Secrets potentiellement exposés dans `.env.example`

**Type** : Information Disclosure
**OWASP** : A02:2021 Cryptographic Failures (mauvaise gestion secrets)
**Sévérité** : 🔴 Critique

**Description** : Le scan initial suggère que `.env.example` contient de vraies clés JWT Supabase, OpenRouter, Resend, Twilio. Si commité, ces clés sont compromises **à vie** (l'historique git les conserve).

**Impact si exploitée** :
- **Supabase service_role** : accès admin complet à la DB (bypass RLS), exfiltration de toutes les données.
- **OpenRouter** : facture illimitée (potentiellement $1000+/jour si abusée).
- **Resend** : spam massif depuis le domaine → blacklist `edusmart.site`.
- **Twilio** : SMS premium-rate frauduleux.

**Remédiation** : [STEP_02](../../tasks/STEP_02.md) — audit + rotation systématique.

---

### V-02 — Login admin hardcodé

**Type** : Broken Authentication
**OWASP** : A07:2021 Identification and Authentication Failures
**Sévérité** : 🔴 Critique

**Description** : `apps/admin/src/app/login/page.tsx` accepte les credentials `directeur@strelitzia.test` / `Test1234!` codés dans le source.

**Impact** : N'importe qui ayant accès à l'URL admin (déployée ou non) peut prendre le contrôle.

**Remédiation** : [STEP_04](../../tasks/STEP_04.md) — Auth Supabase réelle.

---

### V-03 — Pas de RLS active (Supabase non créée)

**Type** : Broken Access Control
**OWASP** : A01:2021 Broken Access Control
**Sévérité** : 🔴 Critique (post-création Supabase)

**Description** : La base n'existe pas encore, mais l'architecture **dépend entièrement** de RLS pour l'isolation tenant. Si on oublie d'activer RLS sur une table après création, **tous les users voient tout**.

**Remédiation** :
- [STEP_01](../../tasks/STEP_01.md) — RLS dans `0002_rls.sql`.
- Test automatisé post-déploiement :
  ```sql
  select tablename, rowsecurity from pg_tables where schemaname='public' and rowsecurity = false;
  -- doit retourner 0 ligne
  ```

---

## 3. Vulnérabilités majeures (P1)

### V-04 — Middleware fallback silencieux

**Type** : Improper Access Control (cross-tenant)
**Sévérité** : 🟡 Moyenne

**Description** : `host.replace('.edusmart.site', '') || 'strelitzia'` → si le slug est inattendu, retombe sur STRELITZIA au lieu de 404.

**Impact** : Un user STRELITZIA tapant `uaz.edusmart.site` (par typo) voit l'UI UAZ avec son propre nom → fuite UX.

**Remédiation** : whitelist + 404 explicite ([TD-04](../12-bugs/TECH_DEBT.md#td-04--middleware-fallback-silencieux)).

---

### V-05 — Pas de validation des inputs server

**Type** : Input Validation
**OWASP** : A03:2021 Injection
**Sévérité** : 🟡 Moyenne

**Description** : Les Server Actions et Route Handlers actuels ne valident pas les payloads.

**Impact** : Payload malformé peut crash, valeurs hors limite (note > 100), injection HTML dans champs texte.

**Remédiation** : `zod` partout — `parsed.success` check avant insertion DB.

---

### V-06 — Pas de rate limiting

**Type** : Resource Exhaustion / DoS
**Sévérité** : 🟡 Moyenne

**Description** : Toutes les routes API et auth sont ouvertes sans limite.

**Impact** :
- Brute force login (1000 essais/seconde possible).
- Spam formulaire contact / inscription école.
- Coût IA explosif (`/api/ai/generate` sans limite).

**Remédiation** : Upstash Redis + `@upstash/ratelimit` :
```ts
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),  // 10 req/h/IP
})
const { success } = await ratelimit.limit(req.ip)
if (!success) return new Response('Too many requests', { status: 429 })
```

---

### V-07 — Pas de CSP / security headers

**Type** : Missing Security Headers
**Sévérité** : 🟡 Moyenne

**Description** : Aucun `next.config.mjs` ne définit `headers()` (CSP, HSTS, X-Frame-Options, etc.).

**Remédiation** : ajouter à chaque app web :

```js
// next.config.mjs
const securityHeaders = [
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(self), microphone=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // CSP : à adapter avec les domaines réels (Vercel, Supabase, OpenRouter, Resend, Unsplash)
  { key: 'Content-Security-Policy',
    value: "default-src 'self'; img-src 'self' https://*.supabase.co https://images.unsplash.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://openrouter.ai;" },
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

---

## 4. Vulnérabilités mineures (P2/P3)

### V-08 — Pas de 2FA

**Sévérité** : 🟢 Faible (acceptable phase mémoire)

**Impact** : Compromission mot de passe `super_admin` ou `director` = compromission complète école.

**Remédiation** : Supabase Auth supporte TOTP — activer en P3.

---

### V-09 — Pas d'audit log

**Sévérité** : 🟢 Faible

**Description** : Aucune table `auth_events` pour tracer login/logout/role_change/sensitive_action.

**Remédiation** : Table `audit_log` + trigger automatique sur mutations sensibles.

---

### V-10 — Cookies Supabase pas hardenés (à vérifier)

**Sévérité** : 🟢 Faible

**Vérification** : Supabase pose `httpOnly` + `secure` par défaut. Confirmer `sameSite='lax'` (et pas `none`).

---

### V-11 — Pas de scan deps automatisé

**Sévérité** : 🟢 Faible

**Remédiation** : activer **Dependabot** + **`pnpm audit`** en CI.

```yaml
# .github/workflows/audit.yml
- run: pnpm audit --audit-level=moderate
```

---

## 5. Vérifications réalisées

| Check | Résultat |
|---|---|
| Présence `.gitignore` couvrant `.env*` | ✅ |
| HTTPS forcé Vercel | ✅ |
| Cookies httpOnly Supabase (config par défaut) | ✅ |
| Versions deps récentes (Next 14.2, React 18.2, Expo 51) | ✅ |
| `dangerouslySetInnerHTML` dans le code | ❌ pas vu |
| `eval` / `Function()` | ❌ pas vu |
| Permissions OAuth Google minimum | À vérifier (scope email/profile uniquement) |
| `service_role_key` jamais préfixée `NEXT_PUBLIC_` | À vérifier (lint custom recommandé) |

---

## 6. Plan de remédiation

| Vuln | Priorité | Effort | STEP |
|---|---|---|---|
| V-01 Secrets exposés | P0 | 2h | [STEP_02](../../tasks/STEP_02.md) |
| V-02 Login hardcodé | P0 | 5h | [STEP_04](../../tasks/STEP_04.md) |
| V-03 RLS Supabase | P0 | inclus | [STEP_01](../../tasks/STEP_01.md) |
| V-04 Middleware fallback | P1 | 30min | [STEP_03](../../tasks/STEP_03.md) |
| V-05 Validation `zod` | P2 | 4h | [STEP_06](../../tasks/STEP_06.md) |
| V-06 Rate limit | P3 | 2h | [STEP_14](../../tasks/STEP_14.md) |
| V-07 CSP headers | P3 | 1h | [STEP_14](../../tasks/STEP_14.md) |
| V-08 2FA | P3 | 4h | post-pilote |
| V-09 Audit log | P3 | 3h | post-pilote |
| V-10 Cookies harden | P2 | 30min | [STEP_04](../../tasks/STEP_04.md) |
| V-11 Deps scan CI | P3 | 30min | [STEP_14](../../tasks/STEP_14.md) |

**Total effort** : ~22h.

---

## 7. Audit RGPD / vie privée (Madagascar — RGPD-light)

> Bien que Madagascar n'applique pas le RGPD européen, les bonnes pratiques s'imposent (élèves mineurs, données scolaires sensibles).

| Aspect | État | À faire |
|---|---|---|
| Consentement parental (élèves <16 ans) | ❌ | Formulaire signature parent (P3) |
| Droit à l'effacement | ❌ | Endpoint `/api/account/delete` (P3) |
| Export des données | ❌ | Endpoint `/api/account/export` JSON+CSV (P3) |
| Politique de confidentialité | ❌ | Page `/privacy` (avant Production Google OAuth) |
| CGU | ❌ | Page `/terms` (idem) |
| Cookies banner | ❌ | Cookie banner pour analytics (Plausible est exempt si privacy-first) |
| Chiffrement at-rest | ✅ | Supabase chiffre par défaut |
| Chiffrement in-transit | ✅ | HTTPS partout |

---

## 8. Liens

- 🔐 [AUTH_FLOW](../08-authentication/AUTH_FLOW.md)
- 🐛 [BUGS_AND_FIXES](../12-bugs/BUGS_AND_FIXES.md)
- 📊 [CURRENT_STATE](../01-overview/CURRENT_STATE.md#8-sécurité--synthèse)
- 📌 [tasks/STEP_02](../../tasks/STEP_02.md), [STEP_04](../../tasks/STEP_04.md), [STEP_14](../../tasks/STEP_14.md)
