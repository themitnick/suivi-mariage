# Guide de Déploiement GitHub Pages

## Configuration initiale

### 1. Préparer le repository GitHub

1. Créez un nouveau repository sur GitHub (si ce n'est pas déjà fait)
2. Clonez ou pushez votre code sur GitHub

### 2. Activer GitHub Pages

**Option A - GitHub Pages Native (Recommandé)**
1. Allez dans les **Settings** de votre repository
2. Naviguez vers **Pages** dans le menu de gauche
3. Dans **Source**, sélectionnez **GitHub Actions**

**Option B - Déploiement via branche gh-pages**
1. Allez dans les **Settings** de votre repository
2. Naviguez vers **Pages** dans le menu de gauche
3. Dans **Source**, sélectionnez **Deploy from a branch**
4. Sélectionnez la branche **gh-pages** (elle sera créée automatiquement lors du premier déploiement)
5. Laissez le dossier sur **/ (root)**

### 3. Configurer les permissions GitHub Actions

1. Allez dans **Settings > Actions > General**
2. Dans **Workflow permissions**, sélectionnez **Read and write permissions**
3. Cochez **Allow GitHub Actions to create and approve pull requests**

## Déploiement

### Déploiement automatique (Recommandé)

Le déploiement se fait automatiquement à chaque push sur la branche `main` grâce à GitHub Actions.

**Deux workflows disponibles** :
- `deploy-native.yml` : Utilise GitHub Pages native (recommandé)
- `deploy.yml` : Utilise la branche gh-pages (traditionnel)

### Déploiement manuel

```bash
# Construire pour GitHub Pages
npm run build:gh-pages

# Déployer manuellement (optionnel)
npm run deploy:gh-pages
```

## URL d'accès

Une fois déployé, votre application sera accessible à :
```
https://[votre-username].github.io/suivi-mariage/
```

## Résolution des problèmes

### ❌ Problème : La branche gh-pages n'est pas créée

**Solution** : 
1. **Recommandé** : Utilisez le workflow `deploy-native.yml` (GitHub Pages native)
   - Allez dans Settings > Pages et sélectionnez "GitHub Actions"
2. **Alternative** : Le workflow `deploy.yml` va créer automatiquement la branche avec `force_orphan: true`
3. Vérifiez que les permissions GitHub Actions sont correctes (voir ci-dessous)

### ❌ Problème : Erreur de permissions

**Solution** :
1. Allez dans Settings > Actions > General
2. Sélectionnez "Read and write permissions"
3. Les workflows incluent maintenant les permissions nécessaires dans le fichier YAML

### ❌ Problème : Page blanche après déploiement
- Vérifiez que le `base-href` est correct dans `build:gh-pages`
- Assurez-vous que GitHub Pages est activé et configuré correctement

### ❌ Problème : Routes Angular ne fonctionnent pas
- Le fichier `404.html` est configuré pour rediriger vers l'application Angular
- Vérifiez que le script dans `index.html` est présent

### ❌ Problème : GitHub Actions échoue
- Vérifiez les permissions dans Settings > Actions > General
- Consultez les logs dans l'onglet Actions de votre repository

## Structure des fichiers de déploiement

```
.github/workflows/deploy.yml    # Workflow GitHub Actions
public/404.html                # Gestion des routes Angular
src/index.html                 # Script pour SPA routing
package.json                   # Scripts de build et deploy
```
