# PROMPT CLAUDE — ÉTAPE 11 : Génération de bulletins PDF + impression

> 🎯 **OBJECTIF** : Permettre l'édition et l'impression de bulletins de notes scolaires officiels au format PDF pour chaque élève et chaque période trimestrielle. L'opération doit être accessible sous forme de téléchargement de fichier depuis la console d'administration web, et sous forme d'impression physique directe (y compris hors-ligne) depuis l'application bureau Electron.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/admin` : Next.js 14 (portail administration)
- `apps/desktop` : Electron 30 + Vite + React (secrétariat offline)
- `packages/shared` : Partage des templates et clients Supabase

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

| Fichier | Action | Description |
|---|---|---|
| `packages/shared/package.json` | **Modifier** | Ajouter la dépendance `@react-pdf/renderer`. |
| `packages/shared/src/pdf/BulletinTemplate.tsx` | **Créer** | Composant de template de bulletin scolaire avec styles `@react-pdf`. |
| `packages/shared/src/pdf/generateBulletin.ts` | **Créer** | Façade côté serveur pour compiler le template en fichier / Buffer de PDF. |
| `packages/shared/src/pdf/types.ts` | **Créer** | Types TypeScript définissant la structure de données attendue par le bulletin. |
| `packages/shared/src/index.ts` | **Modifier** | Exporter les utilitaires PDF. |
| `apps/admin/src/app/api/bulletin/[studentId]/[period]/route.ts` | **Créer** | Route API retournant le PDF compilé en flux et le sauvegardant dans le bucket Supabase `bulletins`. |
| `apps/desktop/electron/ipc/print.cjs` | **Créer** | Canal IPC pour compiler le PDF en local (SQLite) et lancer l'impression papier via Electron. |

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez exécuter les étapes suivantes :

### 1. Installer la Dépendance dans `@edusmart/shared`
```bash
cd packages/shared
pnpm add @react-pdf/renderer
```

### 2. Créer le Template de Bulletin de Notes (`packages/shared/src/pdf/BulletinTemplate.tsx`)
Concevoir un template propre et professionnel en utilisant les primitives de mise en page de `@react-pdf/renderer` (`Document`, `Page`, `View`, `Text`, `StyleSheet`, `Image`) :
*   En-tête contenant le logo de l'école et son adresse.
*   Encadré contenant l'identité de l'élève, la classe et la période (T1, T2...).
*   Tableau des notes détaillant les matières, les notes obtenues, les coefficients, les appréciations de l'enseignant et la moyenne globale de l'élève.
*   Pied de page avec date de génération automatique et nom du directeur.

### 3. Route API Web d'Édition (`apps/admin/src/app/api/bulletin/[studentId]/[period]/route.ts`)
Développer le Route Handler côté Next.js :
*   Récupérer les informations de l'élève, de l'organisation et l'ensemble de ses notes de la période.
*   Calculer la moyenne générale pondérée de l'élève.
*   Générer le PDF en flux binaire avec `renderToStream()` de react-pdf.
*   Enregistrer une copie du fichier PDF généré sur le bucket privé `bulletins` de Supabase Storage.
*   Retourner la réponse avec l'en-tête `Content-Type: application/pdf` et `Content-Disposition: inline`.

### 4. Impression Physique Locale dans Electron (`apps/desktop/electron/ipc/print.cjs`)
Créer la fonction d'impression directe pour le secrétariat de l'école :
*   Récupérer la structure de données du bulletin depuis la base de données SQLite locale ( offline OK).
*   Générer le document PDF et l'enregistrer dans le dossier temporaire du système d'exploitation à l'aide de `renderToFile()`.
*   Instancier une `BrowserWindow` d'Electron invisible (mode caché), y charger le fichier PDF généré, puis appeler la fonction native de contrôle d'impression `webContents.print({ silent: false })` pour ouvrir la boîte de dialogue d'impression du système.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  **Test Web** : En interrogeant la route `localhost:3002/api/bulletin/<STUDENT_ID>/T1`, le navigateur charge le visualiseur de PDF natif affichant le bulletin propre et typographié.
2.  Le logo de l'établissement et sa moyenne générale s'affichent correctement.
3.  **Test Bureau** : Cliquer sur le bouton d'impression depuis l'application Electron hors-ligne génère le fichier temporaire et ouvre la fenêtre de choix d'imprimante Windows/macOS.
4.  Les caractères accentués de la langue française s'affichent correctement (fontes Helvetica/Courier standard).
