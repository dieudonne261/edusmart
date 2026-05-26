# PROMPT CLAUDE — ÉTAPE 13 : Tests automatisés (Vitest unitaires + Playwright E2E)

> 🎯 **OBJECTIF** : Mettre en œuvre une suite de tests automatisés pour assurer la non-régression de la plateforme. Cela implique de configurer **Vitest** pour les tests unitaires et d'intégration (fichiers utilitaires, calculs de notes et Server Actions) et **Playwright** pour valider les scénarios fonctionnels E2E critiques (notamment l'étanchéité multi-tenant).

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/admin` : Next.js 14 (portail administration)
- `apps/vitrine` : Next.js 14 (site public)
- `packages/shared` : Contient le code métier et le client Supabase

Il n'y a actuellement aucun outil de test configuré dans le projet.

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER À LA RACINE ET DANS LES DOSSIERS CONCERNÉS)

```
EduSmart/
├── vitest.config.ts                      ← Fichier de configuration de Vitest
├── playwright.config.ts                  ← Fichier de configuration de Playwright
├── package.json                          ← Scripts globaux de lancement des tests
├── test/
│   ├── setup.ts                          ← Fichier d'initialisation de l'environnement de test Vitest
│   ├── fixtures/
│   │   ├── organizations.ts              ← Fixtures d'écoles (Strelitzia, UAZ)
│   │   └── students.ts                   ← Fixtures d'élèves
│   └── mocks/
│       └── handlers.ts                   ← Mocks d'API MSW (si besoin)
├── packages/shared/src/utils/
│   └── gradeCalc.test.ts                 ← Test unitaire du calcul de moyenne pondérée
├── apps/admin/src/app/students/
│   └── actions.test.ts                   ← Test d'intégration de la Server Action d'ajout d'élève
└── e2e/
    ├── admin-login.spec.ts               ← Scénario E2E de connexion à l'administration
    ├── multi-tenant.spec.ts              ← Scénario E2E d'isolation étanche entre les deux écoles
    └── student-crud.spec.ts              ← Scénario E2E de gestion des élèves
```

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez appliquer les modifications suivantes :

### 1. Installer les Outils à la Racine du Projet
```bash
# Installer Vitest et happy-dom pour émuler le DOM
pnpm add -D -w vitest @vitest/coverage-v8 happy-dom @testing-library/react @testing-library/jest-dom msw
# Installer Playwright et ses navigateurs de test
pnpm add -D -w @playwright/test
npx playwright install chromium
```

### 2. Configurer Vitest (`vitest.config.ts`)
Créer le fichier à la racine en configurant l'environnement de rendu HTML `happy-dom`, le chargement du setup de test et les seuils minimaux de couverture de code (ex: 60 % de lignes couvertes).

### 3. Créer le Test Unitaire de Calcul de Note (`packages/shared/src/utils/gradeCalc.test.ts`)
Tester la fonction `calculateAverage(grades)` pour vérifier :
*   La prise en compte correcte des coefficients.
*   La conversion correcte des notes lorsque la note maximale n'est pas 20 (ex: 8/10 converti en 16/20).
*   La valeur par défaut renvoyée (0) lorsque la liste de notes est vide.

### 4. Créer le Test d'Intégration d'Action Server (`apps/admin/src/app/students/actions.test.ts`)
Développer un test d'intégration qui mocke le client Supabase et la fonction `getAdminTenant()` pour valider le comportement de la Server Action `createStudent()` :
*   Vérifier que l'insertion est rejetée si le prénom est manquant (validation Zod).
*   Vérifier que l'insertion réussit et retourne `{ success: true }` lorsque le payload est complet.

### 5. Configurer Playwright (`playwright.config.ts`)
Paramétrer les tests E2E pour utiliser Chrome en local, cibler par défaut l'URL `http://localhost:3002`, et démarrer automatiquement le serveur de développement de l'administration avant l'exécution du test :
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3002', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    command: 'pnpm --filter @edusmart/admin dev',
    port: 3002,
    reuseExistingServer: !process.env.CI,
  },
})
```

### 6. Rédiger le Scénario d'Étanchéité Multi-tenant (`e2e/multi-tenant.spec.ts`)
Écrire les scénarios de test suivants :
*   Le directeur de Strelitzia se connecte à `strelitzia.edusmart.site/admin` et vérifie qu'il voit ses élèves (ex: Miora Rakoto).
*   Le directeur de UAZ se connecte à `uaz.edusmart.site/admin` et vérifie qu'il ne voit pas l'élève Miora Rakoto (qui appartient à Strelitzia).
*   Une tentative de visite de `uaz.edusmart.site/admin` avec la session active de Strelitzia doit déclencher une redirection vers la page `/forbidden`.

### 7. Ajouter les Scripts dans le package.json Racine
```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  La commande `pnpm test` s'exécute et passe l'ensemble des tests unitaires et d'intégration au vert.
2.  La couverture de code générée par `pnpm test:coverage` est supérieure ou égale à 60 % pour les fichiers testés.
3.  La commande `pnpm test:e2e` démarre le serveur de développement, exécute les navigateurs de test Playwright en arrière-plan et valide les 3 scénarios (login, crud, isolation).
4.  La tentative de triche cross-tenant d'un utilisateur est bien captée et bloque l'affichage de la page de manière étanche.
