# Script para ejecutar análisis estático con Semgrep usando Docker
# Requiere Docker Desktop ejecutándose

Write-Host "🔍 Ejecutando análisis estático con Semgrep..." -ForegroundColor Cyan

# Verificar que Docker esté corriendo
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Crear directorio reports si no existe
if (-not (Test-Path "reports")) {
    New-Item -ItemType Directory -Path "reports" | Out-Null
}

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "📥 Descargando imagen de Semgrep (si es necesario)..." -ForegroundColor Yellow
docker pull semgrep/semgrep:latest | Out-Null

Write-Host "🔎 Analizando código fuente..." -ForegroundColor Yellow

# Ejecutar Semgrep y guardar resultados en texto
docker run --rm `
    -v "${PWD}:/src" `
    -w /src `
    semgrep/semgrep:latest `
    semgrep `
    --config=auto `
    src/ > reports/semgrep-analysis.txt 2>&1

if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 1) {
    Write-Host "✅ Análisis completado: reports/semgrep-analysis.txt" -ForegroundColor Green
} else {
    Write-Host "⚠️  Análisis completado con código de salida: $LASTEXITCODE" -ForegroundColor Yellow
}

Write-Host "`n✨ Análisis completado!" -ForegroundColor Green
