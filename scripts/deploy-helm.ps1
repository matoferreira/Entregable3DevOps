# Script para desplegar con Helm
# PowerShell Script

param(
    [string]$Environment = "production",
    [string]$ImageTag = "1.0.0"
)

Write-Host "☸️  Desplegando con Helm..." -ForegroundColor Cyan

$RELEASE_NAME = "travel-track-api"
$CHART_PATH = "./helm/travel-track-api"
$NAMESPACE = "travel-track"

# Verificar que Helm está instalado
if (-not (Get-Command helm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Helm no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar que el chart existe
if (-not (Test-Path $CHART_PATH)) {
    Write-Host "❌ Chart no encontrado en $CHART_PATH" -ForegroundColor Red
    exit 1
}

# Validar chart
Write-Host "`n🔍 Validando chart..." -ForegroundColor Cyan
helm lint $CHART_PATH

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ El chart tiene errores" -ForegroundColor Red
    exit 1
}

# Verificar si ya existe un release
$releaseExists = helm list -n $NAMESPACE -q | Select-String -Pattern "^$RELEASE_NAME$"

if ($releaseExists) {
    Write-Host "`n🔄 Actualizando release existente..." -ForegroundColor Yellow
    helm upgrade $RELEASE_NAME $CHART_PATH `
        --namespace $NAMESPACE `
        --set image.tag=$ImageTag `
        --set config.nodeEnv=$Environment `
        --wait
} else {
    Write-Host "`n🚀 Instalando nuevo release..." -ForegroundColor Green
    helm install $RELEASE_NAME $CHART_PATH `
        --namespace $NAMESPACE `
        --create-namespace `
        --set image.tag=$ImageTag `
        --set config.nodeEnv=$Environment `
        --wait
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Despliegue exitoso" -ForegroundColor Green
    
    # Mostrar estado
    Write-Host "`n📊 Estado del deployment:" -ForegroundColor Cyan
    kubectl get all -n $NAMESPACE
    
    Write-Host "`n📝 Para ver los logs:" -ForegroundColor Yellow
    Write-Host "kubectl logs -n $NAMESPACE -l app.kubernetes.io/name=travel-track-api -f" -ForegroundColor White
    
    Write-Host "`n🌐 Para acceder localmente:" -ForegroundColor Yellow
    Write-Host "kubectl port-forward -n $NAMESPACE svc/$RELEASE_NAME 3000:80" -ForegroundColor White
    
} else {
    Write-Host "`n❌ Error en el despliegue" -ForegroundColor Red
    exit 1
}
