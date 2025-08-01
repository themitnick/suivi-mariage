# 🚀 Guide Rapide - Déploiement GitHub Pages

## ✅ Configuration recommandée (GitHub Pages Native)

### 1. Push votre code sur GitHub
```bash
git add .
git commit -m "Add GitHub Pages deployment configuration"
git push origin main
```

### 2. Configurez GitHub Pages
1. Allez dans **Settings** > **Pages** de votre repository
2. Sélectionnez **Source** : `GitHub Actions`
3. Les workflows se déclencheront automatiquement

### 3. Vérifiez les permissions
1. **Settings** > **Actions** > **General**
2. Sélectionnez **"Read and write permissions"**

## 🎯 Workflows disponibles

### `deploy-native.yml` (Recommandé)
- ✅ Utilise GitHub Pages native
- ✅ Plus moderne et stable
- ✅ Pas besoin de branche gh-pages
- ✅ Configuration dans Settings > Pages > GitHub Actions

### `deploy.yml` (Alternative)
- ✅ Crée automatiquement la branche gh-pages
- ✅ Configuration dans Settings > Pages > Deploy from branch
- ✅ Compatible avec les anciennes configurations

## 🔧 En cas de problème

### La branche gh-pages n'existe pas ?
➡️ **Solution** : Utilisez `deploy-native.yml` (pas besoin de branche)

### Erreur de permissions ?
➡️ **Solution** : Settings > Actions > General > "Read and write permissions"

### Page blanche ?
➡️ **Solution** : Vérifiez le base-href dans `package.json` script `build:gh-pages`

## 📱 Test de l'application

**URL finale** : `https://[username].github.io/suivi-mariage/`

**Comptes de test** :
- **Citoyen** : Code `ABC1234DEF` + Nom `Yao`
- **Célébrant** : Email `celebrant@mairie-plateau.ci` + Mot de passe `password123`
