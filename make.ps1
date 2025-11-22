# Makefile-style script para PowerShell
# Uso: .\make.ps1 <target>

param(
    [Parameter(Position=0)]
    [string]$Target = "help"
)

$IMAGE_NAME = "travel-track-api"
$IMAGE_TAG = "1.0.0"
$HELM_RELEASE = "travel-track-api"
$HELM_CHART = "./helm/travel-track-api"
$NAMESPACE = "travel-track"

function Show-Help {
    Write-Host "Travel Track API - Comandos Disponibles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Desarrollo:" -ForegroundColor Yellow
    Write-Host "  install          - Instalar dependencias npm"
    Write-Host "  dev              - Ejecutar en modo desarrollo"
    Write-Host "  build            - Compilar el proyecto"
    Write-Host "  test             - Ejecutar tests"
    Write-Host ""
    Write-Host "Docker:" -ForegroundColor Yellow
    Write-Host "  docker-build     - Construir imagen Docker"
    Write-Host "  docker-run       - Ejecutar contenedor Docker"
    Write-Host "  docker-stop      - Detener contenedor Docker"
    Write-Host "  docker-clean     - Limpiar imágenes Docker"
    Write-Host ""
    Write-Host "Kubernetes/Helm:" -ForegroundColor Yellow
    Write-Host "  k8s-deploy       - Desplegar con Helm"
    Write-Host "  k8s-upgrade      - Actualizar despliegue"
    Write-Host "  k8s-uninstall    - Desinstalar release"
    Write-Host "  k8s-status       - Ver estado del despliegue"
    Write-Host "  k8s-logs         - Ver logs"
    Write-Host "  k8s-port-forward - Port forward a localhost"
    Write-Host ""
    Write-Host "Análisis:" -ForegroundColor Yellow
    Write-Host "  scan             - Escanear seguridad"
    Write-Host "  analyze          - Analizar tamaño de imagen"
    Write-Host "  lint-chart       - Validar Helm chart"
    Write-Host ""
    Write-Host "Uso: .\make.ps1 <target>" -ForegroundColor Gray
}

function Install-Dependencies {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
    npm install
}

function Start-Dev {
    Write-Host "🚀 Iniciando en modo desarrollo..." -ForegroundColor Cyan
    npm run start:dev
}

function Build-Project {
    Write-Host "🔨 Compilando proyecto..." -ForegroundColor Cyan
    npm run build
}

function Run-Tests {
    Write-Host "🧪 Ejecutando tests..." -ForegroundColor Cyan
    npm test
}

function Build-Docker {
    Write-Host "🐳 Construyendo imagen Docker..." -ForegroundColor Cyan
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Imagen construida: ${IMAGE_NAME}:${IMAGE_TAG}" -ForegroundColor Green
    }
}

function Run-Docker {
    Write-Host "🐳 Ejecutando contenedor Docker..." -ForegroundColor Cyan
    docker run -d `
        --name $IMAGE_NAME `
        -p 3000:3000 `
        -e NODE_ENV=production `
        -e PORT=3000 `
        "${IMAGE_NAME}:${IMAGE_TAG}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Contenedor ejecutándose en http://localhost:3000" -ForegroundColor Green
    }
}

function Stop-Docker {
    Write-Host "🛑 Deteniendo contenedor Docker..." -ForegroundColor Cyan
    docker stop $IMAGE_NAME
    docker rm $IMAGE_NAME
}

function Clean-Docker {
    Write-Host "🧹 Limpiando imágenes Docker..." -ForegroundColor Cyan
    docker rmi "${IMAGE_NAME}:${IMAGE_TAG}"
}

function Deploy-K8s {
    Write-Host "☸️  Desplegando con Helm..." -ForegroundColor Cyan
    helm install $HELM_RELEASE $HELM_CHART --create-namespace --namespace $NAMESPACE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Desplegado exitosamente" -ForegroundColor Green
        kubectl get all -n $NAMESPACE
    }
}

function Upgrade-K8s {
    Write-Host "🔄 Actualizando despliegue..." -ForegroundColor Cyan
    helm upgrade $HELM_RELEASE $HELM_CHART --namespace $NAMESPACE
}

function Uninstall-K8s {
    Write-Host "🗑️  Desinstalando release..." -ForegroundColor Cyan
    helm uninstall $HELM_RELEASE --namespace $NAMESPACE
}

function Show-K8sStatus {
    Write-Host "📊 Estado del despliegue:" -ForegroundColor Cyan
    kubectl get all -n $NAMESPACE
}

function Show-K8sLogs {
    Write-Host "📝 Logs de la aplicación:" -ForegroundColor Cyan
    kubectl logs -n $NAMESPACE -l app.kubernetes.io/name=travel-track-api -f
}

function Start-PortForward {
    Write-Host "🌐 Port forwarding a localhost:3000..." -ForegroundColor Cyan
    kubectl port-forward -n $NAMESPACE "svc/$HELM_RELEASE" 3000:80
}

function Scan-Security {
    Write-Host "🔐 Escaneando seguridad..." -ForegroundColor Cyan
    .\scripts\security-scan.ps1 -ImageTag $IMAGE_TAG
}

function Analyze-Image {
    Write-Host "📊 Analizando imagen..." -ForegroundColor Cyan
    docker history "${IMAGE_NAME}:${IMAGE_TAG}" --human
    Write-Host ""
    docker images "${IMAGE_NAME}:${IMAGE_TAG}"
}

function Lint-Chart {
    Write-Host "✅ Validando Helm chart..." -ForegroundColor Cyan
    helm lint $HELM_CHART
}

# Ejecutar el target especificado
switch ($Target.ToLower()) {
    "help" { Show-Help }
    "install" { Install-Dependencies }
    "dev" { Start-Dev }
    "build" { Build-Project }
    "test" { Run-Tests }
    "docker-build" { Build-Docker }
    "docker-run" { Run-Docker }
    "docker-stop" { Stop-Docker }
    "docker-clean" { Clean-Docker }
    "k8s-deploy" { Deploy-K8s }
    "k8s-upgrade" { Upgrade-K8s }
    "k8s-uninstall" { Uninstall-K8s }
    "k8s-status" { Show-K8sStatus }
    "k8s-logs" { Show-K8sLogs }
    "k8s-port-forward" { Start-PortForward }
    "scan" { Scan-Security }
    "analyze" { Analyze-Image }
    "lint-chart" { Lint-Chart }
    default {
        Write-Host "❌ Target desconocido: $Target" -ForegroundColor Red
        Write-Host ""
        Show-Help
        exit 1
    }
}
