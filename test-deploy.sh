#!/bin/bash

echo "🔍 Test de configuration GitHub Pages..."
echo ""

# Vérifier que le script build existe
echo "✅ Vérification du script build:gh-pages..."
if npm run build:gh-pages --dry-run 2>/dev/null; then
    echo "   ✅ Script build:gh-pages existe"
else
    echo "   ❌ Script build:gh-pages manquant"
    exit 1
fi

# Tester le build
echo ""
echo "🏗️  Test du build..."
npm run build:gh-pages

# Vérifier que les fichiers sont créés au bon endroit
echo ""
echo "📁 Vérification de la structure de fichiers..."
if [ -d "dist/suivi-mariage/browser" ]; then
    echo "   ✅ Répertoire dist/suivi-mariage/browser existe"
    if [ -f "dist/suivi-mariage/browser/index.html" ]; then
        echo "   ✅ index.html présent"
    else
        echo "   ❌ index.html manquant"
    fi
    if [ -f "dist/suivi-mariage/browser/404.html" ]; then
        echo "   ✅ 404.html présent"
    else
        echo "   ❌ 404.html manquant"
    fi
else
    echo "   ❌ Répertoire dist/suivi-mariage/browser manquant"
    exit 1
fi

echo ""
echo "🎉 Configuration GitHub Pages prête !"
echo "   Vous pouvez maintenant pousser sur GitHub"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. git add ."
echo "   2. git commit -m 'Fix GitHub Pages deployment'"
echo "   3. git push origin main"
echo "   4. Configurer GitHub Pages : Settings > Pages > Deploy from branch > gh-pages"
