# Script para construir y analizar la imagen Docker
# PowerShell Script

Write-Host "🐳 Construyendo imagen Docker..." -ForegroundColor Cyan

# Variables
$IMAGE_NAME = "travel-track-api"
$IMAGE_TAG = "1.0.0"
$FULL_IMAGE = "${IMAGE_NAME}:${IMAGE_TAG}"

# Construir imagen
docker build -t $FULL_IMAGE .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Imagen construida exitosamente" -ForegroundColor Green
    
    # Mostrar tamaño
    Write-Host "`n📊 Tamaño de la imagen:" -ForegroundColor Cyan
    docker images $FULL_IMAGE
    
    # Análisis de capas
    Write-Host "`n📋 Historial de capas:" -ForegroundColor Cyan
    docker history $FULL_IMAGE --human
    
    # Análisis con dive (si está disponible)
    Write-Host "`n🔍 Para análisis detallado, ejecuta:" -ForegroundColor Yellow
    Write-Host "docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive:latest $FULL_IMAGE" -ForegroundColor White
    
} else {
    Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
    exit 1
}
