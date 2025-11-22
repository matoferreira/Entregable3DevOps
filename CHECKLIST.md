# ✅ Checklist de Verificación DevOps

Usa esta lista para verificar que todo esté funcionando correctamente.

## 📋 Pre-requisitos

- [ ] Node.js 20+ instalado
- [ ] Docker Desktop instalado y ejecutándose
- [ ] Kubernetes habilitado en Docker Desktop
- [ ] Helm 3+ instalado (`helm version`)
- [ ] Git instalado

## 🔧 Paso 1: Configuración Inicial

- [ ] Ejecutar `npm install` exitosamente
- [ ] Crear archivo `.env` desde `.env.example`
- [ ] Verificar que no hay errores de TypeScript (`npm run build`)
- [ ] Ejecutar tests (`npm test`)

## 🐳 Paso 2: Docker

### Construcción
- [ ] Construir imagen: `.\scripts\build-image.ps1`
- [ ] Verificar que la imagen existe: `docker images travel-track-api:1.0.0`
- [ ] Tamaño de imagen < 300 MB
- [ ] Sin errores durante el build

### Análisis
- [ ] Ejecutar análisis: `.\scripts\analyze-image.ps1`
- [ ] Puntuación de optimización >= 4/5
- [ ] Usuario configurado: `nestjs`
- [ ] Healthcheck configurado
- [ ] Imagen base Alpine confirmada

### Seguridad
- [ ] Ejecutar escaneo: `.\scripts\security-scan.ps1`
- [ ] Revisar vulnerabilidades CRITICAL y HIGH
- [ ] Usuario no-root verificado
- [ ] No ejecuta como root

### Ejecución Local
- [ ] Ejecutar contenedor: `.\make.ps1 docker-run`
- [ ] Acceder a http://localhost:3000/api/docs
- [ ] API Swagger responde correctamente
- [ ] Detener contenedor sin errores

## ☸️ Paso 3: Kubernetes (Local)

### Validación de Manifiestos
- [ ] Validar namespace: `kubectl apply --dry-run=client -f k8s/namespace.yaml`
- [ ] Validar configmap: `kubectl apply --dry-run=client -f k8s/configmap.yaml`
- [ ] Validar deployment: `kubectl apply --dry-run=client -f k8s/deployment.yaml`
- [ ] Validar service: `kubectl apply --dry-run=client -f k8s/service.yaml`

### Helm Chart
- [ ] Validar chart: `helm lint ./helm/travel-track-api`
- [ ] Sin errores en la validación
- [ ] Sin warnings críticos
- [ ] Template rendering: `helm template travel-track-api ./helm/travel-track-api`

### Despliegue
- [ ] Instalar con Helm: `.\scripts\deploy-helm.ps1`
- [ ] Verificar namespace creado: `kubectl get namespace travel-track`
- [ ] Verificar pods corriendo: `kubectl get pods -n travel-track`
- [ ] Verificar service creado: `kubectl get svc -n travel-track`
- [ ] Pods en estado `Running`
- [ ] Readiness probe exitoso

### Acceso al Servicio
- [ ] Port forward: `kubectl port-forward -n travel-track svc/travel-track-api 3000:80`
- [ ] Acceder a http://localhost:3000/api/docs
- [ ] API responde correctamente
- [ ] Ver logs: `kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api`

## 📊 Paso 4: Verificaciones Avanzadas

### Resources
- [ ] Verificar requests configurados: `kubectl describe deployment -n travel-track`
- [ ] CPU request: 100m
- [ ] CPU limit: 200m
- [ ] Memory request: 128Mi
- [ ] Memory limit: 256Mi

### Security Contexts
- [ ] Pod runAsNonRoot: true
- [ ] Container runAsUser: 1001
- [ ] allowPrivilegeEscalation: false
- [ ] Capabilities dropped

### ConfigMap
- [ ] ConfigMap existe: `kubectl get configmap -n travel-track`
- [ ] Variables correctas: `kubectl describe configmap -n travel-track`
- [ ] NODE_ENV configurado
- [ ] PORT configurado
- [ ] APP_VERSION configurado

### Probes
- [ ] Liveness probe configurado
- [ ] Readiness probe configurado
- [ ] Probes ejecutándose: `kubectl describe pod -n travel-track`

## 🔄 Paso 5: Actualización

- [ ] Cambiar versión en values.yaml
- [ ] Actualizar con Helm: `helm upgrade travel-track-api ./helm/travel-track-api`
- [ ] Rollout exitoso: `kubectl rollout status deployment/travel-track-api -n travel-track`
- [ ] Sin downtime

## 🧹 Paso 6: Limpieza

- [ ] Desinstalar Helm release: `helm uninstall travel-track-api`
- [ ] Eliminar namespace: `kubectl delete namespace travel-track`
- [ ] Limpiar imágenes Docker: `docker rmi travel-track-api:1.0.0`

## 📝 Documentación

- [ ] README.md actualizado y claro
- [ ] QUICKSTART.md proporciona guía clara
- [ ] DEVOPS.md contiene información completa
- [ ] Scripts tienen comentarios útiles
- [ ] Helm Chart tiene NOTES.txt informativos

## 🎯 Características DevOps Implementadas

### Configuración Externa
- [ ] Variables en .env.example
- [ ] ConfigModule de NestJS configurado
- [ ] ConfigService usado en main.ts
- [ ] ConfigMaps en Kubernetes
- [ ] Sin valores hardcodeados en código

### Docker
- [ ] Multi-stage build (3 stages)
- [ ] Imagen Alpine
- [ ] Usuario no-root
- [ ] Versión específica (no latest)
- [ ] .dockerignore optimizado
- [ ] Healthcheck funcional
- [ ] dumb-init instalado
- [ ] Tamaño optimizado

### Kubernetes
- [ ] Namespace exclusivo
- [ ] Deployment con réplicas
- [ ] Service ClusterIP
- [ ] ConfigMap con variables
- [ ] Resources requests definidos
- [ ] Resources limits definidos
- [ ] Liveness probe
- [ ] Readiness probe
- [ ] Security contexts
- [ ] Versiones específicas

### Helm
- [ ] Chart.yaml válido
- [ ] values.yaml completo
- [ ] values-dev.yaml
- [ ] values-prod.yaml
- [ ] Templates parametrizables
- [ ] Helpers definidos
- [ ] ServiceAccount template
- [ ] HPA template (opcional)
- [ ] NOTES.txt informativos

### CI/CD
- [ ] Workflow de GitHub Actions
- [ ] Build automatizado
- [ ] Tests automatizados
- [ ] Escaneo de seguridad
- [ ] Deploy automatizado
- [ ] Multi-entorno (dev/prod)

## 🚨 Problemas Comunes

### ❌ Error: Cannot find module '@nestjs/config'
**Solución:** Ejecuta `npm install`

### ❌ Docker build falla
**Solución:** 
- Verifica Docker Desktop está ejecutándose
- Revisa .dockerignore no excluye archivos necesarios
- Intenta: `docker system prune -a`

### ❌ Pods no inician
**Solución:**
- Verifica imagen existe localmente: `docker images`
- Revisa logs: `kubectl logs -n travel-track <pod-name>`
- Verifica resources: `kubectl describe pod -n travel-track <pod-name>`

### ❌ Helm lint falla
**Solución:**
- Verifica sintaxis YAML
- Revisa templates con: `helm template ./helm/travel-track-api`
- Verifica valores requeridos en values.yaml

### ❌ Port forward no funciona
**Solución:**
- Verifica el pod está Running
- Verifica el service existe
- Usa el nombre correcto del service

## ✅ Checklist Final

- [ ] Proyecto compila sin errores
- [ ] Imagen Docker construida y optimizada
- [ ] Análisis de seguridad pasado
- [ ] Manifiestos K8s validados
- [ ] Helm Chart lintado exitosamente
- [ ] Despliegue local exitoso
- [ ] API accesible y funcional
- [ ] Documentación completa
- [ ] Scripts funcionan correctamente
- [ ] Todo limpiado y testeado

## 🎉 ¡Completado!

Si todos los ítems están marcados, ¡tu proyecto está listo para producción!

### Siguientes Pasos Recomendados

1. **CI/CD**: Configurar GitHub Actions con los secrets necesarios
2. **Monitoring**: Agregar Prometheus y Grafana
3. **Logging**: Implementar stack ELK o Loki
4. **Ingress**: Configurar Ingress Controller para acceso externo
5. **TLS**: Agregar certificados SSL/TLS
6. **Backup**: Estrategia de backup de datos
7. **Disaster Recovery**: Plan de recuperación
8. **Scaling**: Configurar HPA basado en métricas reales

---

**Fecha de verificación:** _________________

**Verificado por:** _________________

**Notas adicionales:**
_____________________________________________
_____________________________________________
_____________________________________________
