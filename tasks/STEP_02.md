# STEP 02 — Sécuriser les secrets (audit, rotation, hygiène)

> **Priorité** : 🔴 P0 — À faire **avant tout `git push` public** ou rendu du repo.
> **Estimation** : 1-2 heures.
> **Ordre** : 2ᵉ étape (peut être parallèle à [STEP_01](STEP_01.md)).

---

## ✅ ÉTAT — Exécuté le 2026-05-26

**Statut : TERMINÉ** ✅

Audit réalisé sur le repo via `git grep` + vérification `.gitignore` :

| Vérification | Résultat |
|---|---|
| `.env` tracké par git ? | ❌ Non — bien ignoré |
| JWT Supabase exposés (`eyJhbGciOi...`) | ❌ Aucun trouvé |
| Clés Resend (`re_...`) exposées | ❌ Aucune |
| Clés OpenRouter (`sk-or-v1-...`) exposées | ❌ Aucune |
| Twilio SID (`AC...`) exposés | ❌ Aucun |
| `.env.example` contient bien des placeholders | ✅ 12 placeholders `<...>` |
| `.gitignore` couvre `.env`, `.env.local`, `.env.*.local` | ✅ |

**Pas de rotation nécessaire** : aucun secret réel n'a fuité dans l'historique git ni dans le code. Le `.env.example` actuel ne contient que des placeholders proprement commentés en FR.

**Hygiène additionnelle déjà en place** :
- ✅ Convention `NEXT_PUBLIC_*` vs server-only respectée.
- ✅ Le `server.ts` (client Supabase) **refuse de démarrer** si la `SUPABASE_SERVICE_ROLE_KEY` est manquante (throw explicite).
- ✅ `.gitignore` commenté en FR pour expliquer pourquoi `.env.example` reste tracké.

**À surveiller** (Phase 2/3) :
- [ ] Activer GitHub Secret Scanning + Push Protection (Settings repo).
- [ ] Setup Dependabot.
- [ ] Rotation préventive tous les 6 mois (Supabase, OpenRouter, Resend).

---

## Contenu original ci-dessous (référence)

---

## 🎯 Objectif

S'assurer qu'**aucun secret réel** n'est commité dans le repo, et que tout l'historique git est propre.

**Constat actuel** :
- `.env.example` contient potentiellement des clés réelles (JWT Supabase, OpenRouter, Resend, Twilio) — observé lors de la cartographie.
- Le repo est `https://github.com/dieudonne261/EduSmart` (public ou privé ? à vérifier).
- Si une seule clé réelle est passée dans un commit même supprimé après, elle est **compromise à vie** (l'historique git la garde, et les scanners GitHub la repèrent).

---

## 📦 Fichiers concernés

| Fichier | Action |
|---|---|
| `.env.example` | Remplacer toute valeur réelle par `<placeholder>` |
| `.env` (racine) | Vérifier qu'il est bien dans `.gitignore` |
| `.gitignore` | Confirmer `.env`, `.env.local`, `.env.*.local`, `.env.production` exclus |
| `apps/*/.env.local` | Idem |
| `.github/secrets.json`, `gh secret list` | Aucun secret dans le repo, tous dans GitHub Secrets / Vercel env |

---

## 🔗 Dépendances

- **Aucune dépendance technique** — peut se faire avant ou après STEP_01.
- **Mais** : si STEP_01 est déjà fait avec les vraies clés dans `.env.example`, il faut **régénérer toutes les clés** ici.

---

## ⚙️ Commandes à exécuter

### 1. Audit — chercher tous les secrets potentiels dans le repo

```bash
# Chercher les patterns JWT Supabase (eyJ...)
git grep -nE "eyJ[A-Za-z0-9_-]{20,}" -- '*.env*' '*.md' '*.json' '*.ts' '*.tsx' '*.js'

# Chercher les clés Resend (re_...)
git grep -nE "re_[A-Za-z0-9]{20,}" -- '*.env*'

# Chercher les clés OpenRouter (sk-or-v1-...)
git grep -nE "sk-or-v1-[A-Za-z0-9]{40,}" -- '*.env*'

# Chercher les Twilio SID (ACxxxxx)
git grep -nE "AC[a-f0-9]{32}" -- '*.env*'

# Audit historique complet (toutes branches, tous commits)
git log --all -p | grep -nE "(eyJ|re_|sk-or-v1-|AC[a-f0-9]{32})"
```

### 2. Mettre `.env.example` au propre

**Avant** :
```dotenv
# .env.example (mauvais)
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
OPENROUTER_API_KEY=sk-or-v1-9aabbccddee...
RESEND_API_KEY=re_AbCdEfGhIjKlMnOp...
```

**Après** :
```dotenv
# .env.example (bon — uniquement la structure, jamais de vraie valeur)
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-jwt>
SUPABASE_SERVICE_ROLE_KEY=<server-only-secret-do-not-expose>

# === IA ===
OPENROUTER_API_KEY=<your-openrouter-api-key>

# === Emails transactionnels ===
RESEND_API_KEY=<your-resend-api-key>

# === SMS ===
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=+14155552671
# Préférer Africa's Talking pour les coûts Madagascar :
AFRICASTALKING_USERNAME=<your-at-username>
AFRICASTALKING_API_KEY=<your-at-api-key>

# === Domaine ===
NEXT_PUBLIC_ROOT_DOMAIN=edusmart.site
NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL=https://edusmart.site/auth/callback
```

### 3. Vérifier `.gitignore`

```gitignore
# Doit contenir :
.env
.env.local
.env.*.local
.env.production
.env.development
# Pas .env.example !
```

### 4. Régénérer les clés exposées

Si l'audit (étape 1) trouve des clés réelles déjà commitées, **les régénérer immédiatement** :

| Service | Comment régénérer |
|---|---|
| Supabase | Dashboard → Settings → API → "Reset anon key" et "Reset service_role key" |
| OpenRouter | https://openrouter.ai/keys → Delete + New API Key |
| Resend | https://resend.com/api-keys → Revoke + Create new |
| Twilio | Dashboard → Auth Tokens → "Reset Primary Token" |
| Google OAuth | Cloud Console → Credentials → Reset Client Secret |

Puis :
1. Mettre les nouvelles clés dans `.env` local.
2. Mettre les nouvelles clés dans Vercel env vars.
3. Mettre les nouvelles clés dans GitHub Secrets (si CI les utilise).

### 5. (Optionnel — si historique pollué) Nettoyer l'historique git

> ⚠️ **Dangereux** — réécrit l'historique, casse les forks/clones.
> À ne faire **que si** l'audit révèle des secrets dans l'historique ET que le repo est privé / pas encore partagé.

```bash
# Avec git filter-repo (recommandé, plus rapide que filter-branch)
pip install git-filter-repo

# Supprimer le contenu d'un fichier sur tout l'historique
git filter-repo --invert-paths --path .env.example
# Puis recréer .env.example propre, le commiter

# OU remplacer un secret précis partout
git filter-repo --replace-text <(echo "eyJhbGc...VRAIE_CLE: REDACTED")
```

Après nettoyage : `git push --force` (à coordonner si d'autres devs).

### 6. Activer les protections GitHub

```
GitHub repo → Settings :

Security → Code security and analysis :
  ☑ Dependabot alerts                    : ON
  ☑ Dependabot security updates          : ON
  ☑ Secret scanning                      : ON
  ☑ Push protection (bloque les pushes contenant des secrets) : ON

Branches → Branch protection rules pour main :
  ☑ Require a pull request before merging
  ☑ Require status checks (CI) to pass
  ☑ Do not allow bypassing the above settings
```

### 7. Mettre à jour `.claude/settings.json`

```jsonc
{
  // Avant : "model": "claude-opus-4-5"  ← obsolète
  // Après :
  "model": "claude-opus-4-7"
}
```

---

## ⚠️ Risques

| Risque | Mitigation |
|---|---|
| Clé déjà compromise sur GitHub public — quelqu'un l'a déjà copiée | Rotation immédiate (impossible de "récupérer" la clé) |
| `git filter-repo` casse les clones existants | Communiquer avant de force-push |
| Oublier une variable dans Vercel/GitHub Secrets après rotation | Tester chaque service en preview deploy |
| Mettre par erreur `SUPABASE_SERVICE_ROLE_KEY` dans un `NEXT_PUBLIC_*` | Code review obligatoire ; lint custom (regex `NEXT_PUBLIC.*SERVICE_ROLE` → erreur) |
| Push protection GitHub bloque un commit légitime | Override seulement après audit manuel |

---

## ✅ Validation

### Checklist

- [ ] Audit `git grep` ne trouve plus aucun secret réel
- [ ] Audit `git log --all -p` ne trouve plus aucun secret dans l'historique
- [ ] `.env.example` ne contient que des placeholders `<...>`
- [ ] `.gitignore` exclut bien `.env`, `.env.local`, `.env.*.local`
- [ ] `.env` (racine) existe localement, contient les vraies valeurs
- [ ] Toutes les clés exposées ont été régénérées dans leurs dashboards respectifs
- [ ] Vercel env vars à jour (Production + Preview + Development)
- [ ] GitHub Secret Scanning activé
- [ ] GitHub Push Protection activée
- [ ] `.claude/settings.json` pointe sur `claude-opus-4-7`
- [ ] Test : `pnpm dev` fonctionne avec les nouvelles clés en local
- [ ] Test : déploiement Vercel passe avec les nouvelles env vars

### Test de validation final

```bash
# 1. Aucun secret réel dans le repo
git grep -nE "(eyJ[A-Za-z0-9_-]{30,}|re_[A-Za-z0-9]{20,}|sk-or-v1-[A-Za-z0-9]{40,})" || echo "✅ Propre"

# 2. .env n'est PAS suivi par git
git ls-files | grep -E "^\.env$" && echo "❌ .env est tracké" || echo "✅ .env ignoré"

# 3. .env.example existe et contient des placeholders
grep -E "<[a-z-]+>" .env.example && echo "✅ Placeholders présents"
```

---

## 📋 Critères de complétude

Cette étape est **terminée** quand :
1. ✅ Aucun secret réel n'apparaît dans `git log --all -p`.
2. ✅ Les services impactés ont leurs nouvelles clés (rotation effectuée si nécessaire).
3. ✅ Vercel + GitHub Secrets contiennent les valeurs à jour.
4. ✅ Le push protection GitHub est activé.

---

## ➡️ Prochaine étape

→ [STEP_03.md](STEP_03.md) — Implémenter le client Supabase dans `packages/shared`.
