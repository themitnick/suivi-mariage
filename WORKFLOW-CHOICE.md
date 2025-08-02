# 🚀 Choix du Workflow de Déploiement

Vous avez maintenant **3 workflows** disponibles. Choisissez celui qui correspond à vos besoins :

## ✅ Option 1: GitHub Pages Native (Recommandé)
**Fichier**: `deploy.yml` (actuel)

### Configuration:
1. **Settings** > **Pages** > **Source**: `GitHub Actions`
2. Désactivez les autres workflows si nécessaire

### Avantages:
- ✅ Plus moderne et officiel
- ✅ Pas de branche gh-pages nécessaire  
- ✅ Meilleure intégration avec GitHub

---

## ✅ Option 2: Création explicite de la branche gh-pages
**Fichier**: `deploy-gh-pages.yml`

### Configuration:
1. **Settings** > **Pages** > **Source**: `Deploy from a branch`
2. **Branch**: `gh-pages` 
3. **Folder**: `/ (root)`

### Avantages:
- ✅ Crée automatiquement la branche gh-pages
- ✅ Compatible avec les anciennes configurations
- ✅ Plus de contrôle sur le processus

---

## ✅ Option 3: Workflow alternatif
**Fichier**: `deploy-native.yml`

### Configuration:
Identique à l'Option 1

---

## 🔧 Comment choisir et configurer

### Étape 1: Choisir un workflow
Renommez ou supprimez les workflows que vous ne voulez pas utiliser.

**Exemple pour Option 2** (création branche gh-pages):
```bash
# Garder seulement deploy-gh-pages.yml
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.backup
mv .github/workflows/deploy-native.yml .github/workflows/deploy-native.yml.backup
```

### Étape 2: Pousser les changements
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Étape 3: Configurer GitHub Pages
- **Pour Option 1 & 3**: Settings > Pages > Source: `GitHub Actions`
- **Pour Option 2**: Settings > Pages > Source: `Deploy from a branch` > `gh-pages`

## 🎯 Recommandation

**Si vous voulez que la branche gh-pages soit créée**, utilisez **Option 2** (`deploy-gh-pages.yml`)

Ce workflow:
- ✅ Crée automatiquement la branche gh-pages
- ✅ Utilise le bon chemin: `./dist/suivi-mariage/browser`
- ✅ A les permissions correctes
- ✅ Utilise `force_orphan: true` pour créer la branche

## 🔍 Vérification

Après le push, vérifiez:
1. **Actions** tab pour voir le workflow s'exécuter
2. **Settings** > **Pages** pour la configuration
3. **Branches** pour voir si gh-pages est créée (Option 2 seulement)
