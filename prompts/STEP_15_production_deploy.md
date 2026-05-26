# PROMPT CLAUDE — ÉTAPE 15 : Déploiement production multi-école + migration edusmart.mg

> 🎯 **OBJECTIF** : Mettre en service la plateforme EduSmart pour l'école pilote (STRELITZIA), importer les données réelles, préparer les supports de formation, configurer le monitoring de production, soumettre les applications mobiles aux stores (Apple App Store et Google Play Store), et réaliser la migration du domaine principal de `edusmart.site` vers `edusmart.mg`.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
L'ensemble des étapes techniques de développement (01 à 14) a été implémenté et validé localement ainsi qu'en environnement de preview.

---

## 📦 LIVRABLES ET PHASES D'EXÉCUTION

Veuillez structurer votre travail en 7 phases distinctes :

### Phase A — Sécurisation et Préparation du Pilote
*   **Audit de sécurité final** : Valider que toutes les vulnérabilités de niveau P0/P1 répertoriées dans le rapport de sécurité ont été corrigées.
*   **Sauvegardes (Backups)** : Programmer une politique de sauvegarde quotidienne automatisée de la base de données PostgreSQL dans la console Supabase.
*   **Pages Légales** : Rédiger et publier les mentions légales, CGU et politiques de confidentialité (`/privacy`, `/terms`, `/cookies`) conformes pour la collecte de données d'élèves mineurs.
*   **Google OAuth** : Passer le projet Google Cloud Platform de l'état "Testing" à "Production" pour lever la limitation de 100 utilisateurs de test.
*   **Bannière Beta** : Ajouter un bandeau discret sur la page de connexion de l'administration pour informer les utilisateurs du statut de projet pilote.

### Phase B — Importation des Données Pilotes (STRELITZIA)
*   Développer un outil d'importation de fichiers CSV à l'adresse `/admin/import`.
*   Cet outil doit permettre à la secrétaire d'uploader un fichier CSV d'élèves, valider les formats de données (champs obligatoires, dates de naissance) avec Zod côté serveur, puis insérer les données en lot (batch) dans la table `students`.
*   Assurer que l'en-tête de sécurité RLS filtre et associe bien les élèves importés à l'ID de l'école active.

### Phase C — Onboarding et Formation
*   **Guide Utilisateur** : Rédiger un fichier d'aide utilisateur complet au format Markdown sous `docs/user-guide-director.md` décrivant les procédures clés (création d'une classe, inscription d'un élève, gestion des enseignants).
*   Créer des guides courts et des supports explicatifs (FAQ parents, mémo enseignant).

### Phase D — Tableau de Bord des KPIs
*   Créer un écran de suivi statistique accessible uniquement par le `super_admin` à l'adresse `/admin/super/kpi` pour mesurer l'adoption et l'efficacité de la plateforme :
    *   *Moyenne de temps de génération des bulletins* (comparaison avant/après).
    *   *Taux de détection précoce du décrochage*.
    *   *Taux d'adoption par les familles* (nombre de connexions uniques de parents par semaine).
    *   *Taux de disponibilité de la plateforme*.

### Phase E — Migration vers le domaine `edusmart.mg`
Planifier la migration après validation du pilote (3 écoles connectées et +100 utilisateurs actifs) :
1.  Enregistrer le nom de domaine national `.mg` auprès du NIC.mg.
2.  Configurer la zone DNS chez le registrar en recopiant les enregistrements du domaine `.site`.
3.  Ajouter les domaines `edusmart.mg` et `*.edusmart.mg` dans la console Vercel.
4.  Mettre en place une redirection 301 permanente des requêtes `edusmart.site` vers `edusmart.mg` dans le middleware ou le fichier `next.config.mjs`.
5.  Mettre à jour la variable d'environnement `NEXT_PUBLIC_ROOT_DOMAIN=edusmart.mg` sur Vercel.
6.  Modifier l'URL principale de redirection d'authentification sur Supabase (`https://edusmart.mg`).
7.  Mettre à jour les enregistrements SPF/DKIM chez le bureau d'enregistrement pour valider l'envoi d'emails via Resend avec le nouveau nom de domaine.

### Phase F — Soumission aux Magasins d'Applications (App Stores)
*   Créer les comptes de développeurs Apple ($99/an) et Google ($25 unique).
*   Générer les captures d'écran promotionnelles requises.
*   Builder les binaires de production en lançant EAS CLI depuis les répertoires `apps/mobile` et `apps/kids` :
    ```bash
    eas build --platform ios --profile production
    eas build --platform android --profile production
    ```
*   Soumettre les applications via `eas submit` et suivre le processus d'examen et de validation des Stores.

### Phase G — Monitoring Post-Launch
*   Activer Vercel Speed Insights en production pour surveiller les temps d'affichage.
*   Configurer un projet Sentry dédié pour chacune des 4 applications en production (admin, vitrine, mobile, kids) afin de filtrer et prioriser les alertes d'erreurs.
*   Publier une page publique de statut de service (statuspage.io ou BetterStack).

---

## ✅ VALIDATION FINALE
1.  L'école pilote STRELITZIA utilise avec succès la plateforme pour sa gestion quotidienne (saisie des notes par les professeurs, accès parents, secrétariat) depuis 4 semaines.
2.  Les indicateurs clés de succès (KPIs) sont mesurés et conformes aux objectifs du mémoire (gain de temps de > 70 % sur la production de bulletins).
3.  Les applications mobiles sont téléchargeables publiquement sur Google Play Store et Apple App Store.
4.  L'accès via le nom de domaine `edusmart.mg` est pleinement fonctionnel et sécurisé par SSL.
5.  Soutenance du mémoire de Master effectuée avec succès avec une démonstration en direct (live demo).
