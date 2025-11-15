# Travel Track API - DevOps Configuration

## 📋 Descripción

Este proyecto implementa una API de gestión de solicitudes de viaje corporativo construida con NestJS, con configuración completa para despliegue en Kubernetes usando Helm.

## 🚀 Características DevOps Implementadas

### ✅ Configuración Externa
- Variables de entorno configurables mediante `.env` o ConfigMaps
- Soporte para múltiples entornos (dev/prod)
- Configuración centralizada usando `@nestjs/config`
- Sin valores hardcodeados en el código fuente

### ✅ Contenerización Segura
- **Dockerfile multi-stage** para optimización de tamaño
- **Usuario no-root** (nestjs:1001) para mayor seguridad
- **Imagen base**: Node.js 20.11.0 Alpine (minimal)
- **Versión explícita**: 1.0.0 (no latest)
- **Healthcheck** integrado
- **dumb-init** para manejo correcto de señales

### ✅ Kubernetes
- **Namespace exclusivo**: `travel-track`
- **Deployment** con réplicas y probes de salud
- **Service** tipo ClusterIP
- **ConfigMap** para variables de entorno
- **Resource limits y requests** definidos
- **Security contexts** configurados

### ✅ Helm Chart
- Chart completo y parametrizable
- Templates para todos los recursos
- Valores configurables via `values.yaml`
- Soporte para autoscaling (HPA)

## 📦 Estructura del Proyecto

```
travel-track-entregable3/
├── src/                          # Código fuente
│   ├── config/
│   │   └── configuration.ts      # Configuración centralizada
│   ├── employee/
│   ├── travel/
│   └── travel-requests/
├── k8s/                          # Manifiestos de Kubernetes
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── deployment.yaml
│   └── service.yaml
├── helm/                         # Helm Chart
│   └── travel-track-api/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── _helpers.tpl
│           ├── namespace.yaml
│           ├── configmap.yaml
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── serviceaccount.yaml
│           └── hpa.yaml
├── .env.example                  # Variables de entorno de ejemplo
├── Dockerfile                    # Multi-stage build
├── .dockerignore
└── package.json
```

## 🔧 Configuración

### Variables de Entorno

Copiar `.env.example` a `.env` y ajustar según sea necesario:

```bash
NODE_ENV=development
PORT=3000
APP_VERSION=1.0.0
APP_NAME=travel-track-api
LOG_LEVEL=info
```

## 🐳 Docker

### Construir la Imagen

```bash
docker build -t travel-track-api:1.0.0 .
```

### Análisis de Tamaño de Imagen

```bash
# Ver tamaño de la imagen
docker images travel-track-api:1.0.0

# Análisis detallado con dive
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive:latest travel-track-api:1.0.0

# Historial de capas
docker history travel-track-api:1.0.0
```

### Optimizaciones Aplicadas

1. **Multi-stage build**: Separa dependencias de build y runtime
2. **Alpine Linux**: Imagen base minimal (~5MB vs ~900MB)
3. **npm ci --only=production**: Solo dependencias necesarias
4. **npm cache clean**: Elimina cache innecesario
5. **.dockerignore**: Excluye archivos no necesarios

### Ejecutar Localmente

```bash
docker run -d \
  --name travel-track-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e APP_VERSION=1.0.0 \
  travel-track-api:1.0.0
```

### Análisis de Seguridad

```bash
# Escanear vulnerabilidades con Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image travel-track-api:1.0.0

# Escanear con Snyk
snyk container test travel-track-api:1.0.0
```

## ☸️ Kubernetes

### Despliegue Manual (sin Helm)

```bash
# Aplicar manifiestos en orden
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verificar despliegue
kubectl get all -n travel-track

# Ver logs
kubectl logs -n travel-track -l app=travel-track-api -f

# Port forward para testing local
kubectl port-forward -n travel-track svc/travel-track-api 3000:80
```

### Recursos Configurados

**CPU:**
- Request: 100m (0.1 CPU)
- Limit: 200m (0.2 CPU)

**Memory:**
- Request: 128Mi
- Limit: 256Mi

## 📊 Despliegue con Helm

### Prerequisitos

```bash
# Instalar Helm (si no está instalado)
# Windows (PowerShell)
choco install kubernetes-helm

# Verificar instalación
helm version
```

### Instalar el Chart

```bash
# Navegar al directorio del proyecto
cd c:\Users\ForiscSe\Downloads\Entregable3DevOps-main\Entregable3DevOps-main\travel-track-entregable3

# Instalar el chart
helm install travel-track-api ./helm/travel-track-api

# O con valores personalizados
helm install travel-track-api ./helm/travel-track-api \
  --set image.tag=1.0.0 \
  --set replicaCount=3 \
  --set config.nodeEnv=production
```

### Actualizar el Despliegue

```bash
# Actualizar valores
helm upgrade travel-track-api ./helm/travel-track-api \
  --set image.tag=1.1.0

# Con archivo de valores personalizado
helm upgrade travel-track-api ./helm/travel-track-api \
  -f custom-values.yaml
```

### Gestión del Chart

```bash
# Listar releases
helm list

# Ver status
helm status travel-track-api

# Ver valores aplicados
helm get values travel-track-api

# Desinstalar
helm uninstall travel-track-api

# Ver manifiestos generados (sin instalar)
helm template travel-track-api ./helm/travel-track-api

# Validar chart
helm lint ./helm/travel-track-api
```

### Personalizar Valores

Crear `custom-values.yaml`:

```yaml
replicaCount: 3

image:
  tag: "1.0.0"

config:
  nodeEnv: production
  logLevel: debug

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## 🔍 Verificación y Monitoreo

```bash
# Estado de los pods
kubectl get pods -n travel-track

# Descripción detallada
kubectl describe deployment travel-track-api -n travel-track

# Logs en tiempo real
kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api -f

# Eventos
kubectl get events -n travel-track --sort-by='.lastTimestamp'

# Métricas de recursos
kubectl top pods -n travel-track
kubectl top nodes
```

## 🧪 Testing

```bash
# Acceder a la API (con port-forward)
kubectl port-forward -n travel-track svc/travel-track-api 3000:80

# En otra terminal
curl http://localhost:3000/api/docs
```

## 📈 Análisis de Tamaño y Optimización

### Herramientas Recomendadas

#### 1. Docker Dive
```bash
# Analizar capas de la imagen
docker run --rm -it ^
  -v /var/run/docker.sock:/var/run/docker.sock ^
  wagoodman/dive:latest travel-track-api:1.0.0
```

#### 2. Docker History
```bash
# Ver tamaño de cada capa
docker history travel-track-api:1.0.0 --human --no-trunc
```

#### 3. Container-diff
```bash
# Comparar dos versiones
container-diff diff daemon://travel-track-api:1.0.0 daemon://travel-track-api:0.9.0 --type=size
```

### Métricas Esperadas

- **Imagen final**: ~150-200 MB
- **Capas totales**: 10-12
- **Eficiencia**: >85% (usando dive)

## 🔐 Seguridad

### Características Implementadas

1. ✅ **No ejecuta como root** (UID 1001)
2. ✅ **Capabilities eliminadas** (drop ALL)
3. ✅ **allowPrivilegeEscalation: false**
4. ✅ **Versiones específicas** (no latest)
5. ✅ **Imagen minimal** (Alpine)
6. ✅ **Secrets no hardcodeados**
7. ✅ **Security contexts** en pod y container
8. ✅ **Resource limits** para prevenir DoS

### Escaneo de Vulnerabilidades

```bash
# Trivy
trivy image travel-track-api:1.0.0

# Grype
grype travel-track-api:1.0.0
```

## 🏗️ CI/CD Pipeline (Ejemplo)

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t travel-track-api:${{ github.sha }} .
      
      - name: Scan with Trivy
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image travel-track-api:${{ github.sha }}
      
      - name: Push to registry
        run: |
          docker tag travel-track-api:${{ github.sha }} registry.example.com/travel-track-api:${{ github.sha }}
          docker push registry.example.com/travel-track-api:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy with Helm
        run: |
          helm upgrade --install travel-track-api ./helm/travel-track-api \
            --set image.tag=${{ github.sha }} \
            --namespace travel-track
```

## 📚 Referencias

- [NestJS Documentation](https://docs.nestjs.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)

## 👥 Mantenimiento

Para actualizar la versión:

1. Actualizar `APP_VERSION` en `.env.example`
2. Actualizar `version` y `appVersion` en `helm/travel-track-api/Chart.yaml`
3. Construir nueva imagen con tag específico
4. Desplegar con Helm usando el nuevo tag

## 📝 Licencia

UNLICENSED - Uso académico
