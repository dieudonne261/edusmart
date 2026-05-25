# BUGS AND FIXES — EduSmart

> Journal chronologique des bugs rencontrés et résolus pendant le développement.
> Tirés des conversations IA et du `RAPPORT_ACTIVITE_DESKTOP.md`.

---

## 1. Tableau récapitulatif

| # | Date | Composant | Sévérité | Statut |
|---|---|---|:-:|:-:|
| 1 | 2026-05-17 | DNS Vercel | 🟡 | ✅ Résolu |
| 2 | 2026-05-17 | Email IMAP / DNS LWS | 🔴 | ✅ Résolu |
| 3 | 2026-05-19 | Google OAuth popup | 🟢 | ✅ Résolu (workaround) |
| 4 | 2026-05-24 | Electron build prod | 🔴 | ✅ Résolu |
| 5 | 2026-05-24 | Electron symlinks Windows | 🔴 | ✅ Résolu |
| 6 | 2026-05-24 | Vite port mismatch | 🟡 | ✅ Résolu |
| 7 | 2026-05-24 | Electron binaire manquant (pnpm Windows) | 🟡 | ✅ Résolu (script auto) |

---

## 2. Bug #1 — Vercel "Invalid Configuration" sur CNAME test

**Date** : 2026-05-17
**Composant** : DNS LWS + Vercel
**Sévérité** : 🟡 Moyenne

### Symptôme
Le sous-domaine `test.edusmart.site` retournait une erreur "Invalid Configuration" dans le dashboard Vercel après avoir suivi les instructions de setup.

### Cause
Vercel a fait évoluer sa valeur de CNAME : l'ancienne `cname.vercel-dns.com` est dépréciée, remplacée par une valeur **unique par projet** :
```
7c280f9aadf5f882.vercel-dns-017.com.
```

### Solution
1. Récupérer la nouvelle valeur exacte dans Dashboard Vercel → Domains → Configure.
2. La coller dans la Zone DNS LWS (au lieu de l'ancienne `cname.vercel-dns.com.`).
3. Attendre propagation DNS (~5-15 minutes).
4. Cliquer "Refresh" dans Vercel.

### Leçon
Vercel a tendance à évoluer ces valeurs. **Toujours copier-coller la valeur affichée dans le dashboard** plutôt que de réutiliser une valeur trouvée dans une vieille doc.

---

## 3. Bug #2 — Outlook IMAP ne joint pas `mail.edusmart.site`

**Date** : 2026-05-17
**Composant** : DNS LWS / wildcard CNAME
**Sévérité** : 🔴 Critique (boîte mail métier KO)

### Symptôme
Outlook (et tout autre client mail) ne pouvait pas se connecter à IMAP/SMTP `mail.edusmart.site`. La résolution DNS pointait vers Vercel au lieu de LWS.

### Cause
Le wildcard CNAME `*.edusmart.site → vercel-dns.com` interceptait **tous** les sous-domaines, y compris `mail.edusmart.site`. Le serveur Vercel n'expose pas IMAP/SMTP, d'où l'échec.

### Solution
Ajouter un enregistrement A **explicite** pour `mail` (un enregistrement explicite gagne sur le wildcard) :

```
A    mail    213.255.195.65    3600    ← LWS IP
MX   @       mail.edusmart.site.    priority 10    3600
```

### Leçon
Un wildcard CNAME impacte **tous** les sous-domaines non explicitement déclarés. Toujours déclarer explicitement les sous-domaines qui ne pointent pas vers la cible du wildcard (mail, ftp, dev, etc.).

---

## 4. Bug #3 — Google OAuth popup affiche "supabase.co" + erreurs

**Date** : 2026-05-19
**Composant** : Auth Google + Supabase
**Sévérité** : 🟢 Mineure (UX, pas bloquant)

### Symptôme
Lors du test du login Google, la popup affichait "Vous allez vous connecter à supabase.co" au lieu de "edusmart.site", et des warnings apparaissaient ("App not verified").

### Cause
1. L'app Google Console était en **mode Testing** (normal pendant le développement).
2. Le domaine `edusmart.site` n'avait pas encore de contenu — Google flag les sites "vides".

### Solution (workaround)
1. Rester en mode **Testing** : ajouter explicitement les 3 emails autorisés dans "Test users".
2. Ne **passer en Production** qu'une fois le site contiendra du contenu réel (vitrine déployée + politique de confidentialité visible).

### Statut
🟡 Workaround acceptable pour la phase mémoire. **Passer en Production** quand : (a) la vitrine est déployée avec contenu, (b) une politique de confidentialité est publiée à `/privacy`, (c) on cible le déploiement réel.

---

## 5. Bug #4 — Electron : fenêtre blanche en build production

**Date** : 2026-05-24
**Composant** : `apps/desktop`
**Sévérité** : 🔴 Critique (app inutilisable en prod)

### Symptôme
En `pnpm dev` tout fonctionnait. Mais après `pnpm build` puis lancement du `.exe`, la fenêtre Electron s'ouvrait **complètement blanche**.

### Cause
Vite générait des chemins d'assets **absolus** (`/assets/main-abc.js`) dans `dist/index.html`. Quand Electron charge `dist/index.html` via `loadFile()`, les chemins absolus sont interprétés comme `file:///assets/...` → 404.

### Solution
Ajouter `base: './'` dans `apps/desktop/vite.config.ts` :

```ts
// apps/desktop/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',          // ← FIX : chemins relatifs
  plugins: [react()],
  server: { port: 5173, strictPort: true },
})
```

### Leçon
Pour toute app Electron utilisant Vite (ou Webpack), **toujours utiliser des chemins relatifs** (`base: './'`) car `file://` ne supporte pas les chemins absolus relatifs au domaine.

---

## 6. Bug #5 — Erreur Windows liens symboliques pendant packaging Electron

**Date** : 2026-05-24
**Composant** : `electron-builder` sous Windows
**Sévérité** : 🔴 Critique (impossible de builder le `.exe`)

### Symptôme
`pnpm --filter @edusmart/desktop build` échouait avec une erreur :
```
ERROR: Cannot create symbolic link : A required privilege is not held by the client.
```

### Cause
`electron-builder` tente par défaut de signer l'exécutable Windows via `signAndEditExecutable` (utilisé pour intégrer l'icône et la signature). Cette opération nécessite des privilèges admin sur Windows pour créer des liens symboliques.

### Solution
Désactiver dans `apps/desktop/package.json` :

```json
{
  "build": {
    "win": {
      "signAndEditExecutable": false
    }
  }
}
```

### Leçon
Sur Windows, le packaging Electron sans signature est largement suffisant pour le développement et la distribution interne. La signature payante (Authenticode certificate) est nécessaire uniquement pour éviter le warning SmartScreen lors de la distribution publique.

---

## 7. Bug #6 — Electron attend port 5173 alors que Vite démarre sur 5174

**Date** : 2026-05-24
**Composant** : `apps/desktop` (Vite + Electron + concurrently)
**Sévérité** : 🟡 Moyenne (DX agaçante)

### Symptôme
Si un autre process occupait le port 5173 (autre instance Vite, ou autre app), Vite démarrait sur 5174 mais Electron continuait d'attendre 5173 → timeout → fenêtre vide.

### Cause
Vite a un comportement "fallback" par défaut : si le port demandé est pris, il passe au suivant. Electron, dans `electron/main.cjs`, hardcode `http://localhost:5173`.

### Solution
Ajouter `strictPort: true` dans `apps/desktop/vite.config.ts` :

```ts
server: {
  port: 5173,
  strictPort: true,  // ← FIX : Vite échoue si 5173 occupé au lieu de fallback
},
```

Maintenant si 5173 est pris, on a une erreur explicite immédiate (qu'on règle en killant l'autre process).

### Leçon
Toujours utiliser `strictPort` quand un autre process (Electron, tests) dépend d'un port fixe.

---

## 8. Bug #7 — Binaire Electron manquant après `pnpm install` Windows

**Date** : 2026-05-24
**Composant** : Installation `electron` via pnpm sous Windows
**Sévérité** : 🟡 Moyenne (réinstall manuelle pénible)

### Symptôme
Après `pnpm install`, le dossier `node_modules/electron/dist/` était parfois incomplet : il manquait `electron.exe` ou `path.txt`, ce qui faisait échouer `pnpm dev` avec :
```
Error: Electron not found
```

### Cause
Bug intermittent du downloader d'Electron sous pnpm + Windows (lié au cache pnpm `.pnpm-store` et aux postinstall scripts).

### Solution
Créer `apps/desktop/scripts/ensure-electron.cjs` qui vérifie la présence des fichiers attendus et relance le download si manquant :

```js
// apps/desktop/scripts/ensure-electron.cjs (squelette)
const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const electronDir = path.join(__dirname, '..', 'node_modules', 'electron', 'dist')
const expected = ['electron.exe', 'path.txt']  // adapter selon OS

const missing = expected.some(f => !fs.existsSync(path.join(electronDir, f)))
if (missing) {
  console.log('[ensure-electron] Binaires manquants, réinstallation...')
  execSync('pnpm rebuild electron', { stdio: 'inherit' })
}
```

Et brancher dans `package.json` :
```json
{
  "scripts": {
    "predev": "node scripts/ensure-electron.cjs",
    "dev": "..."
  }
}
```

### Leçon
Les binaires natifs (Electron, sqlite, sharp…) ont des bugs d'install récurrents sous Windows + pnpm. Un script `predev` auto-réparateur est plus robuste qu'un README "lancez `pnpm rebuild electron` si ça plante".

---

## 9. Bugs en attente / à surveiller

| Surveillance | Risque | Quand |
|---|---|---|
| Middleware fallback silencieux slug invalide | Cross-tenant accidentel | Tester avec slug random |
| Cookies Supabase domaine `.edusmart.site` | Pas partagés en localhost | Vérifier en preview Vercel |
| Vercel ISR cache pas invalidé après update orga | Theming ancien visible 60s | Acceptable, sinon `revalidatePath` |
| Apple notarisation refusée (desktop macOS) | Pas de distribution macOS clean | Compter Apple Dev Program si besoin |
| Expo SDK 51 → 52 migration | API breaking changes | Différer P3 |

---

## 10. Comment ajouter un bug à ce journal

Format standard pour chaque nouveau bug :

```markdown
## Bug #X — <titre court>

**Date** : YYYY-MM-DD
**Composant** : <chemin/dossier>
**Sévérité** : 🔴 Critique / 🟡 Moyenne / 🟢 Mineure

### Symptôme
<ce qu'on observe>

### Cause
<root cause identifiée>

### Solution
<patch / config / commande>

### Leçon
<règle générale à retenir>
```

---

## 11. Liens

- 🐛 [TECH_DEBT](TECH_DEBT.md)
- 🛡️ [SECURITY_REPORT](../14-security/SECURITY_REPORT.md)
- 📊 [CURRENT_STATE](../01-overview/CURRENT_STATE.md)
- 🗂️ [MASTER_INDEX](../MASTER_INDEX.md)
