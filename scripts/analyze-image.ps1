# Script de análisis completo de imagen Docker
# PowerShell Script

param(
    [string]$ImageTag = "1.0.0"
)

$IMAGE = "travel-track-api:${ImageTag}"

Write-Host "🔍 Análisis Completo de Imagen Docker" -ForegroundColor Cyan
Write-Host "Imagen: $IMAGE" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que la imagen existe
$imageExists = docker images -q $IMAGE

if (-not $imageExists) {
    Write-Host "❌ La imagen $IMAGE no existe" -ForegroundColor Red
    Write-Host "Ejecuta primero: docker build -t $IMAGE ." -ForegroundColor Yellow
    exit 1
}

# 1. Tamaño total
Write-Host "📦 TAMAÑO DE IMAGEN" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Gray
docker images $IMAGE --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
Write-Host ""

# 2. Historial de capas
Write-Host "📋 CAPAS DE LA IMAGEN (Top 10 más grandes)" -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Gray
docker history $IMAGE --human | Select-Object -First 11
Write-Host ""

# 3. Configuración de usuario
Write-Host "👤 CONFIGURACIÓN DE SEGURIDAD" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Gray
$user = docker inspect $IMAGE --format='{{.Config.User}}'
if ($user -eq "nestjs") {
    Write-Host "  ✓ Usuario: $user" -ForegroundColor Green
} elseif ($user -eq "") {
    Write-Host "  ✗ Usuario: root (por defecto)" -ForegroundColor Red
} else {
    Write-Host "  ~ Usuario: $user" -ForegroundColor Yellow
}

$workdir = docker inspect $IMAGE --format='{{.Config.WorkingDir}}'
Write-Host "  WorkDir: $workdir" -ForegroundColor White

# Verificar capabilities
$config = docker inspect $IMAGE --format='{{json .Config}}' | ConvertFrom-Json
Write-Host ""

# 4. Variables de entorno
Write-Host "🔧 VARIABLES DE ENTORNO" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Gray
docker inspect $IMAGE --format='{{range .Config.Env}}{{println .}}{{end}}' | ForEach-Object {
    if ($_ -match "^(PATH|NODE_VERSION|YARN_VERSION)=") {
        Write-Host "  $_" -ForegroundColor DarkGray
    } else {
        Write-Host "  $_" -ForegroundColor White
    }
}
Write-Host ""

# 5. Healthcheck
Write-Host "💚 HEALTHCHECK" -ForegroundColor Yellow
Write-Host "--------------" -ForegroundColor Gray
$healthcheck = docker inspect $IMAGE --format='{{json .Config.Healthcheck}}' 
if ($healthcheck -ne "null" -and $healthcheck -ne "") {
    Write-Host "  ✓ Configurado" -ForegroundColor Green
    $healthcheck | ConvertFrom-Json | Format-List | Out-String | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} else {
    Write-Host "  ✗ No configurado" -ForegroundColor Red
}
Write-Host ""

# 6. Puertos expuestos
Write-Host "🔌 PUERTOS EXPUESTOS" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Gray
$ports = docker inspect $IMAGE --format='{{json .Config.ExposedPorts}}' | ConvertFrom-Json
if ($ports) {
    $ports.PSObject.Properties | ForEach-Object {
        Write-Host "  $($_.Name)" -ForegroundColor White
    }
} else {
    Write-Host "  Ninguno" -ForegroundColor DarkGray
}
Write-Host ""

# 7. Estadísticas de la imagen
Write-Host "📊 ESTADÍSTICAS" -ForegroundColor Yellow
Write-Host "---------------" -ForegroundColor Gray

$totalSize = docker inspect $IMAGE --format='{{.Size}}' 
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "  Tamaño total: $totalSizeMB MB" -ForegroundColor White

$layerCount = (docker history $IMAGE --quiet).Count
Write-Host "  Número de capas: $layerCount" -ForegroundColor White

$created = docker inspect $IMAGE --format='{{.Created}}'
Write-Host "  Creada: $created" -ForegroundColor White
Write-Host ""

# 8. Recomendaciones de análisis adicional
Write-Host "🔬 ANÁLISIS ADICIONAL RECOMENDADO" -ForegroundColor Yellow
Write-Host "----------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "  1. Análisis detallado con Dive:" -ForegroundColor Cyan
Write-Host "     docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive:latest $IMAGE" -ForegroundColor White
Write-Host ""
Write-Host "  2. Escaneo de seguridad con Trivy:" -ForegroundColor Cyan
Write-Host "     .\scripts\security-scan.ps1 -ImageTag $ImageTag" -ForegroundColor White
Write-Host ""
Write-Host "  3. Historial completo de capas:" -ForegroundColor Cyan
Write-Host "     docker history $IMAGE --human --no-trunc" -ForegroundColor White
Write-Host ""

# 9. Resumen
Write-Host "✅ RESUMEN" -ForegroundColor Green
Write-Host "----------" -ForegroundColor Gray

$score = 0
$maxScore = 5

if ($user -eq "nestjs") { 
    $score++ 
    Write-Host "  ✓ Usuario no-root configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ Usuario root o no configurado" -ForegroundColor Red
}

if ($totalSizeMB -lt 300) { 
    $score++ 
    Write-Host "  ✓ Tamaño optimizado (< 300 MB)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Imagen grande (> 300 MB)" -ForegroundColor Yellow
}

if ($layerCount -lt 15) { 
    $score++ 
    Write-Host "  ✓ Número de capas razonable (< 15)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Muchas capas (> 15)" -ForegroundColor Yellow
}

if ($healthcheck -ne "null" -and $healthcheck -ne "") { 
    $score++ 
    Write-Host "  ✓ Healthcheck configurado" -ForegroundColor Green
} else {
    Write-Host "  ✗ Healthcheck no configurado" -ForegroundColor Yellow
}

$baseImage = docker inspect $IMAGE --format='{{index .Config.Image}}'
if ($baseImage -match "alpine") { 
    $score++ 
    Write-Host "  ✓ Usando imagen base minimal (Alpine)" -ForegroundColor Green
} else {
    Write-Host "  ~ No está usando Alpine" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Puntuación de optimización: $score/$maxScore" -ForegroundColor $(if ($score -ge 4) { "Green" } elseif ($score -ge 3) { "Yellow" } else { "Red" })

if ($score -ge 4) {
    Write-Host "🎉 ¡Excelente! La imagen está bien optimizada." -ForegroundColor Green
} elseif ($score -ge 3) {
    Write-Host "👍 Bien. Hay algunas mejoras posibles." -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Se recomienda optimizar la imagen." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Análisis completado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
