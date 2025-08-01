# Système de Réservation de Mariages - Mairie du Plateau

## Description

Application web de réservation de mariages en ligne pour la Mairie du Plateau à Abidjan, Côte d'Ivoire. Cette application permet aux citoyens de réserver leurs mariages civils en ligne et aux célébrants de gérer ces réservations.

## 🚀 Déploiement sur GitHub Pages

Cette application est configurée pour être déployée automatiquement sur GitHub Pages via GitHub Actions.

### Configuration requise

1. **Permissions GitHub Actions** : Allez dans `Settings > Actions > General` et assurez-vous que les permissions d'écriture sont activées
2. **GitHub Pages** : Allez dans `Settings > Pages` et sélectionnez `Deploy from a branch` puis `gh-pages` comme source

### Déploiement automatique

Le déploiement se fait automatiquement à chaque push sur la branche `main`. Le workflow GitHub Actions :
- Installe les dépendances
- Build l'application avec la configuration GitHub Pages
- Déploie sur la branche `gh-pages`

### Déploiement manuel

Pour déployer manuellement depuis votre machine locale :

```bash
# Installer les dépendances
npm ci

# Déployer sur GitHub Pages
npm run deploy:gh-pages
```

### URL de l'application

Une fois déployée, l'application sera accessible à l'adresse :
`https://[votre-username].github.io/suivi-mariage/`

## Fonctionnalités

### Pour les Citoyens
- ✅ **Réservation en ligne** : Formulaire complet pour réserver un mariage
- ✅ **Sélection de créneaux** : Choix de date et heure parmi les créneaux disponibles
- ✅ **Validation en temps réel** : Vérification des informations saisies
- ✅ **Interface responsive** : Compatible mobile et desktop

### Pour les Célébrants
- ✅ **Dashboard de gestion** : Vue d'ensemble des mariages
- ✅ **Gestion des statuts** : Confirmer, terminer ou annuler les mariages
- ✅ **Système de messagerie** : Communication directe avec les futurs mariés
- ✅ **Filtres et recherche** : Trouver rapidement les dossiers
- ✅ **Statistiques** : Vue d'ensemble des activités

### Fonctionnalités Générales
- ✅ **Authentification** : Système de connexion sécurisé
- ✅ **Interface moderne** : Design avec Tailwind CSS
- ✅ **Navigation intuitive** : UX optimisée
- ✅ **Gestion d'état** : Services Angular avec RxJS

## Technologies Utilisées

- **Frontend** : Angular 20 (dernière version)
- **Styling** : Tailwind CSS 3.4.17
- **Language** : TypeScript
- **Formulaires** : Angular Reactive Forms
- **Routing** : Angular Router avec Guards
- **State Management** : Services Angular + RxJS

## Nouvelles Syntaxes Angular Utilisées

Le projet utilise les dernières syntaxes d'Angular :

- ✅ **Directives de contrôle** : `@if`, `@for`, `@switch` au lieu de `*ngIf`, `*ngFor`
- ✅ **Composants standalone** : Tous les composants sont standalone
- ✅ **Signals** (prêt pour migration future)
- ✅ **Nouvelle structure de fichiers** : Séparation template/component

## Installation et Démarrage

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

3. **Ouvrir l'application**
   - Navigateur : `http://localhost:4200`

## Comptes de Test

### Célébrant
- **Email** : `celebrant@mairie-plateau.ci`
- **Mot de passe** : `password123`

### Citoyen (pour tests)
- **Email** : `citoyen@example.com`
- **Mot de passe** : `password123`
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
