# Script para análisis de seguridad
# PowerShell Script

param(
    [string]$ImageTag = "1.0.0"
)

$IMAGE_NAME = "travel-track-api"
$FULL_IMAGE = "${IMAGE_NAME}:${ImageTag}"

Write-Host "🔐 Análisis de Seguridad de la Imagen Docker" -ForegroundColor Cyan
Write-Host "Imagen: $FULL_IMAGE" -ForegroundColor White

# Verificar que la imagen existe
$imageExists = docker images -q $FULL_IMAGE

if (-not $imageExists) {
    Write-Host "❌ La imagen $FULL_IMAGE no existe" -ForegroundColor Red
    exit 1
}

# Análisis con Trivy
Write-Host "`n🔍 Escaneando con Trivy..." -ForegroundColor Yellow
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock `
    aquasec/trivy:latest image $FULL_IMAGE

# Información adicional
Write-Host "`n📋 Información de la imagen:" -ForegroundColor Cyan
docker inspect $FULL_IMAGE --format='{{json .Config}}' | ConvertFrom-Json | Select-Object User, WorkingDir, ExposedPorts | Format-List

Write-Host "`n✅ Verificaciones de seguridad:" -ForegroundColor Green

# Verificar usuario no-root
$user = docker inspect $FULL_IMAGE --format='{{.Config.User}}'
if ($user -eq "nestjs") {
    Write-Host "  ✓ Usuario no-root configurado: $user" -ForegroundColor Green
} else {
    Write-Host "  ✗ Advertencia: Usuario root o no configurado" -ForegroundColor Red
}

# Verificar healthcheck
$healthcheck = docker inspect $FULL_IMAGE --format='{{.Config.Healthcheck}}'
if ($healthcheck -ne "<nil>") {
    Write-Host "  ✓ Healthcheck configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ Healthcheck no configurado" -ForegroundColor Yellow
}

Write-Host "`n📊 Tamaño de la imagen:" -ForegroundColor Cyan
docker images $FULL_IMAGE --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
