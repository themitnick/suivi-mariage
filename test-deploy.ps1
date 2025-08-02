# Test de configuration GitHub Pages
Write-Host "🔍 Test de configuration GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Vérifier que le script build existe
Write-Host "✅ Vérification du script build:gh-pages..." -ForegroundColor Green
try {
    $buildScript = npm run build:gh-pages --dry-run 2>$null
    Write-Host "   ✅ Script build:gh-pages existe" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Script build:gh-pages manquant" -ForegroundColor Red
    exit 1
}

# Tester le build
Write-Host ""
Write-Host "🏗️  Test du build..." -ForegroundColor Yellow
npm run build:gh-pages

# Vérifier que les fichiers sont créés au bon endroit
Write-Host ""
Write-Host "📁 Vérification de la structure de fichiers..." -ForegroundColor Cyan

if (Test-Path "dist/suivi-mariage/browser") {
    Write-Host "   ✅ Répertoire dist/suivi-mariage/browser existe" -ForegroundColor Green
    
    if (Test-Path "dist/suivi-mariage/browser/index.html") {
        Write-Host "   ✅ index.html présent" -ForegroundColor Green
    } else {
        Write-Host "   ❌ index.html manquant" -ForegroundColor Red
    }
    
    if (Test-Path "dist/suivi-mariage/browser/404.html") {
        Write-Host "   ✅ 404.html présent" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 404.html manquant" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Répertoire dist/suivi-mariage/browser manquant" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Configuration GitHub Pages prête !" -ForegroundColor Green
Write-Host "   Vous pouvez maintenant pousser sur GitHub" -ForegroundColor White
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. git add ." -ForegroundColor White
Write-Host "   2. git commit -m 'Fix GitHub Pages deployment'" -ForegroundColor White
Write-Host "   3. git push origin main" -ForegroundColor White
Write-Host "   4. Configurer GitHub Pages : Settings > Pages > Deploy from branch > gh-pages" -ForegroundColor White
