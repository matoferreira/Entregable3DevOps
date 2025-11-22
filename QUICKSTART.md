# 🚀 Quick Start Guide

## Prerequisitos

- Docker Desktop instalado y ejecutándose
- Kubernetes habilitado en Docker Desktop
- Helm 3+ instalado
- Node.js 20+ (para desarrollo local)

## 1️⃣ Desarrollo Local

```powershell
# Instalar dependencias
npm install

# Configurar variables de entorno
Copy-Item .env.example .env

# Ejecutar en modo desarrollo
npm run start:dev

# Acceder a la API
# http://localhost:3000/api/docs
```

## 2️⃣ Construir Imagen Docker

```powershell
# Opción 1: Usando el script
.\scripts\build-image.ps1

# Opción 2: Manualmente
docker build -t travel-track-api:1.0.0 .

# Verificar imagen
docker images travel-track-api:1.0.0
```

## 3️⃣ Ejecutar con Docker

```powershell
docker run -d `
  --name travel-track-api `
  -p 3000:3000 `
  -e NODE_ENV=production `
  -e PORT=3000 `
  travel-track-api:1.0.0

# Acceder a la API
# http://localhost:3000/api/docs

# Ver logs
docker logs -f travel-track-api

# Detener
docker stop travel-track-api
docker rm travel-track-api
```

## 4️⃣ Desplegar en Kubernetes con Helm

```powershell
# Opción 1: Usando el script
.\scripts\deploy-helm.ps1

# Opción 2: Manualmente
helm install travel-track-api ./helm/travel-track-api

# Verificar despliegue
kubectl get all -n travel-track

# Port forward para acceder
kubectl port-forward -n travel-track svc/travel-track-api 3000:80

# Acceder a la API
# http://localhost:3000/api/docs
```

## 5️⃣ Análisis y Optimización

```powershell
# Análisis de seguridad
.\scripts\security-scan.ps1

# Análisis de tamaño con Dive
docker run --rm -it `
  -v /var/run/docker.sock:/var/run/docker.sock `
  wagoodman/dive:latest travel-track-api:1.0.0
```

## 6️⃣ Actualizar Despliegue

```powershell
# Construir nueva versión
docker build -t travel-track-api:1.1.0 .

# Actualizar con Helm
helm upgrade travel-track-api ./helm/travel-track-api `
  --set image.tag=1.1.0

# Verificar actualización
kubectl rollout status deployment/travel-track-api -n travel-track
```

## 7️⃣ Limpieza

```powershell
# Desinstalar Helm release
helm uninstall travel-track-api

# Eliminar namespace (opcional)
kubectl delete namespace travel-track

# Limpiar imágenes Docker
docker rmi travel-track-api:1.0.0
```

## 🐛 Troubleshooting

### Pods no inician
```powershell
kubectl describe pod -n travel-track -l app.kubernetes.io/name=travel-track-api
kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api
```

### Imagen no se encuentra
```powershell
# Verificar que la imagen existe localmente
docker images | Select-String "travel-track"

# Si usas un registry, asegúrate de hacer push
docker tag travel-track-api:1.0.0 your-registry/travel-track-api:1.0.0
docker push your-registry/travel-track-api:1.0.0
```

### ConfigMap no se aplica
```powershell
kubectl get configmap -n travel-track
kubectl describe configmap travel-track-api-config -n travel-track
```

## 📚 Comandos Útiles

```powershell
# Ver logs en tiempo real
kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api -f

# Ejecutar shell en el pod
kubectl exec -it -n travel-track deployment/travel-track-api -- sh

# Ver eventos
kubectl get events -n travel-track --sort-by='.lastTimestamp'

# Ver recursos consumidos
kubectl top pods -n travel-track

# Validar manifiestos de Helm
helm template travel-track-api ./helm/travel-track-api

# Validar chart
helm lint ./helm/travel-track-api
```

## 🎯 Siguientes Pasos

1. Configurar un Ingress para acceso externo
2. Agregar un certificado SSL/TLS
3. Configurar persistent volumes si es necesario
4. Implementar monitoreo con Prometheus/Grafana
5. Configurar alertas
6. Implementar CI/CD pipeline

## 📞 Soporte

Para más detalles, consulta `DEVOPS.md`
