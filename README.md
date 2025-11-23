# Travel Requests API

API REST para gestionar solicitudes de viaje corporativo de TravelTrack. Desarrollada con NestJS y TypeScript.

## 📋 Descripción

Microservicio HTTP que permite crear, consultar, aprobar y rechazar solicitudes de viaje de empleados.

## 🚀 Quick Start

Para una guía rápida de despliegue, consulta [QUICKSTART.md](QUICKSTART.md)

Para documentación completa de DevOps, consulta [DEVOPS.md](DEVOPS.md)

### Inicio Rápido con Scripts

```powershell
# Ver todos los comandos disponibles
.\make.ps1 help

# Desarrollo local
.\make.ps1 install
.\make.ps1 dev

# Docker
.\make.ps1 docker-build
.\make.ps1 docker-run

# Kubernetes
.\make.ps1 k8s-deploy
.\make.ps1 k8s-status
```

## 📦 Requisitos

- Node.js v20 o superior
- npm
- Docker (opcional, para containerización)
- Kubernetes + Helm (opcional, para despliegue)

## 🔧 Instalación

```bash
npm install
```

## ⚙️ Configuración

Copia el archivo de ejemplo y configura las variables de entorno:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:
- `NODE_ENV` - Entorno (development/production)
- `PORT` - Puerto de la aplicación (default: 3000)
- `APP_VERSION` - Versión de la aplicación
- `APP_NAME` - Nombre de la aplicación
- `LOG_LEVEL` - Nivel de logging (info/debug/error)

## 🏃 Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start

# Modo desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run start:prod
```

La aplicación se ejecutará por defecto en `http://localhost:3000`

## 📚 Documentación API

Una vez iniciada la aplicación, accede a la documentación Swagger en:

```
http://localhost:3000/api/docs
```

## 🔌 Endpoints disponibles

### Health Check
- `GET /` - Mensaje de bienvenida

### Travel Requests
- `POST /travel-requests` - Crear nueva solicitud de viaje
- `GET /travel-requests` - Obtener todas las solicitudes
- `PATCH /travel-requests/:id/approve` - Aprobar una solicitud
- `PATCH /travel-requests/:id/reject` - Rechazar una solicitud

## 💡 Ejemplo de uso

```bash
# Crear una solicitud de viaje
curl -X POST http://localhost:3000/travel-requests \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "uuid-del-empleado",
    "destination": "Madrid",
    "days": 4
  }'

# Obtener todas las solicitudes
curl http://localhost:3000/travel-requests

# Aprobar una solicitud
curl -X PATCH http://localhost:3000/travel-requests/{id}/approve

# Rechazar una solicitud
curl -X PATCH http://localhost:3000/travel-requests/{id}/reject
```

## 🐳 Docker

### Construir imagen
```bash
docker build -t travel-track-api:1.0.0 .
```

### Ejecutar contenedor
```bash
docker run -d -p 3000:3000 travel-track-api:1.0.0
```

## ☸️ Kubernetes

### Desplegar con Helm
```bash
helm install travel-track-api ./helm/travel-track-api
```

### Acceder al servicio
```bash
kubectl port-forward -n travel-track svc/travel-track-api 3000:80
```

Consulta [DEVOPS.md](DEVOPS.md) para instrucciones completas de despliegue.

## 🔒 Seguridad

Este proyecto implementa múltiples capas de seguridad siguiendo las mejores prácticas de DevSecOps:

### Análisis de Seguridad Implementado

#### 1. Análisis Estático de Código (SAST) - Semgrep
- **Herramienta:** Semgrep
- **Resultado:** 0 findings detectados
- **Cobertura:** 252 reglas ejecutadas en 33 archivos
- **Lenguajes analizados:** TypeScript, JSON, YAML, Dockerfile
- **Reporte:** `reports/semgrep-analysis.txt`

```bash
# Ejecutar análisis con Semgrep
cd scripts
./run-semgrep.sh  # Linux/macOS
./run-semgrep.ps1 # Windows
```

#### 2. Análisis de Dependencias (SCA) - npm audit
- **Herramienta:** npm audit
- **Estado inicial:** 8 vulnerabilidades (2 high, 2 moderate, 4 low)
- **Estado final:** 0 vulnerabilidades ✅
- **Solución:** Overrides en `package.json` para dependencias transitivas
- **Reportes:** 
  - `reports/npm-audit-initial.txt`
  - `reports/npm-audit-fixed.txt`

```bash
# Verificar vulnerabilidades
npm audit

# Ver reporte completo
cat reports/npm-audit-fixed.txt
```

#### 3. Análisis de Imagen Docker - Trivy
- **Herramienta:** Trivy
- **Vulnerabilidades Alpine Linux:** 32 → 0 ✅ (resueltas actualizando a Alpine 3.22.2)
- **Vulnerabilidades Node.js:** 6 → 2 high (parcialmente resueltas)
- **Reporte:** `reports/trivyreport.txt`

```bash
# Escanear imagen Docker
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image travel-track-api:1.0.0
```

#### 4. Análisis de Composición de Imagen - SlimToolkit
- **Herramienta:** SlimToolkit (DockerSlim)
- **Tamaño total:** 178 MB
- **Capas:** 9 capas
- **Análisis:** Desglose detallado de capas, archivos duplicados, optimizaciones
- **Reporte:** `reports/image-analysis.md`

```bash
# Analizar imagen con SlimToolkit
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  dslim/slim:latest xray --target travel-track-api:1.0.0
```

#### 5. Políticas de Seguridad en Kubernetes - Kyverno
- **Herramienta:** Kyverno
- **Políticas implementadas:**
  1. **Prohibir imágenes con tag `latest`**
  2. **Exigir límites y solicitudes de recursos en todos los pods**
  3. **Impedir ejecución de contenedores como root**
- **Ubicación:** `k8s/kyverno-policies/`
- **Documentación:** `k8s/kyverno-policies/KYVERNO-POLICIES.md`

```bash
# Aplicar políticas de Kyverno
kubectl apply -f k8s/kyverno-policies/

# Verificar políticas
kubectl get clusterpolicies
```

#### 6. Seguridad en Tiempo de Ejecución - Falco
- **Herramienta:** Falco (instalado con Helm)
- **Instalación:** `helm install falco falcosecurity/falco --namespace falco --create-namespace --set tty=true`
- **Funcionalidad:** Detección de actividades sospechosas en tiempo real
- **Alertas capturadas:** Acceso a archivos sensibles, shells interactivas, etc.
- **Reporte:** `reports/falco-event.log`

```bash
# Ver alertas de Falco
kubectl logs -l app.kubernetes.io/name=falco -n falco -c falco | grep Warning

# Ver reporte de alertas
cat reports/falco-event.log
```

### Resumen de Seguridad

| Capa de Seguridad | Herramienta | Estado | Reporte |
|-------------------|-------------|--------|---------|
| **Código Fuente** | Semgrep (SAST) | ✅ 0 findings | `reports/semgrep-analysis.txt` |
| **Dependencias** | npm audit (SCA) | ✅ 0 vulnerabilidades | `reports/npm-audit-fixed.txt` |
| **Imagen Docker** | Trivy | ✅ Alpine: 0 vulns<br>⚠️ Node.js: 2 high | `reports/trivyreport.txt` |
| **Composición Imagen** | SlimToolkit | ✅ Analizado | `reports/image-analysis.md` |
| **Kubernetes** | Kyverno | ✅ 3 políticas activas | `k8s/kyverno-policies/` |
| **Runtime** | Falco | ✅ Monitoreando | `reports/falco-event.log` |

### Documentación de Seguridad

- **Resumen completo:** [reports/RESUMEN-FINAL-VULNERABILIDADES.md](reports/RESUMEN-FINAL-VULNERABILIDADES.md)
- **Análisis de imagen:** [reports/image-analysis.md](reports/image-analysis.md)
- **Políticas Kyverno:** [k8s/kyverno-policies/KYVERNO-POLICIES.md](k8s/kyverno-policies/KYVERNO-POLICIES.md)

### Mejores Prácticas Implementadas

✅ **Código:**
- Análisis estático con Semgrep
- Validación de dependencias con npm audit
- Overrides para dependencias transitivas vulnerables

✅ **Container:**
- Multi-stage builds para imágenes mínimas
- Usuario no-root en contenedores
- Imagen base Alpine Linux actualizada
- Análisis de tamaño y optimización

✅ **Kubernetes:**
- Políticas de seguridad con Kyverno
- Security contexts configurados
- Resource limits y requests
- Prohibición de imágenes `latest`

✅ **Runtime:**
- Monitoreo en tiempo real con Falco
- Detección de actividades sospechosas
- Alertas de seguridad automáticas

## 🧪 Testing

Este proyecto incluye una suite completa de tests para verificar que la aplicación funcione correctamente en todos los niveles.

### Tests Unitarios

Los tests unitarios verifican la funcionalidad de controladores, servicios y módulos individuales.

```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:cov
```

**Cobertura actual:**
- ✅ 7 test suites pasando
- ✅ Tests para: AppController, EmployeeController, TravelController, TravelRequestsController
- ✅ Tests para: EmployeeService, TravelService, TravelRequestsService

### Tests End-to-End (E2E)

Los tests E2E verifican el comportamiento completo de la aplicación desde el punto de vista del usuario.

```bash
# Ejecutar tests E2E
npm run test:e2e
```

**Tests E2E incluidos:**
- ✅ Verificación del endpoint raíz (`GET /`)
- ✅ Validación de inicialización de datos de ejemplo

### Verificación Manual de Endpoints

Después de desplegar la aplicación, puedes verificar manualmente que todos los endpoints funcionen correctamente:

```bash
# 1. Verificar que la aplicación está corriendo
curl http://localhost:3000/
# Respuesta esperada: "Travel Track API - Sistema de gestión de viajes corporativos"

# 2. Verificar health check
curl http://localhost:3000/health
# Respuesta esperada: JSON con status, timestamp, service, version, environment

# 3. Obtener todas las solicitudes de viaje
curl http://localhost:3000/travel-requests
# Respuesta esperada: Array JSON con solicitudes de viaje

# 4. Crear una nueva solicitud de viaje
curl -X POST http://localhost:3000/travel-requests \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "uuid-del-empleado-existente",
    "destination": "Barcelona, España",
    "days": 5
  }'
# Respuesta esperada: JSON con la solicitud creada (status: PENDING)

# 5. Aprobar una solicitud
curl -X PATCH http://localhost:3000/travel-requests/{id}/approve
# Respuesta esperada: JSON con la solicitud actualizada (status: APPROVED)

# 6. Rechazar una solicitud
curl -X PATCH http://localhost:3000/travel-requests/{id}/reject
# Respuesta esperada: JSON con la solicitud actualizada (status: REJECTED)
```

### Verificación en Kubernetes

Si la aplicación está desplegada en Kubernetes:

```bash
# 1. Verificar estado de los pods
kubectl get pods -n travel-track

# 2. Ver logs de la aplicación
kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api --tail=50

# 3. Port forward para acceder localmente
kubectl port-forward -n travel-track svc/travel-track-api 3000:80

# 4. Probar endpoints (en otra terminal)
curl http://localhost:3000/health
```

### Verificación de Build

Antes de desplegar, verifica que el build funcione correctamente:

```bash
# 1. Compilar la aplicación
npm run build

# 2. Verificar que se generaron los archivos JavaScript
ls -la dist/main.js
# Debe existir el archivo dist/main.js

# 3. Verificar que la aplicación compilada funciona
npm run start:prod
# La aplicación debe iniciar sin errores
```

## 🔧 Troubleshooting

Esta sección documenta problemas comunes encontrados durante el desarrollo y sus soluciones.

### Problema: Build no genera archivos JavaScript

**Síntomas:**
- El comando `npm run build` se ejecuta sin errores pero no genera archivos `.js` en `dist/`
- Solo se generan archivos `.d.ts` (declaraciones de tipos)
- La aplicación no puede iniciar porque falta `dist/main.js`

**Causa:**
El archivo `tsconfig.build.tsbuildinfo` puede corromperse o contener información incremental incorrecta que impide que TypeScript genere los archivos JavaScript.

**Solución:**
```bash
# 1. Eliminar el archivo de información incremental
rm -f tsconfig.build.tsbuildinfo

# 2. Limpiar el directorio dist
rm -rf dist

# 3. Recompilar
npm run build

# 4. Verificar que se generaron los archivos
ls -la dist/main.js
```

**Prevención:**
- El archivo `tsconfig.build.tsbuildinfo` está incluido en `.gitignore` para evitar problemas
- El `Dockerfile` incluye un paso que elimina este archivo antes del build:
  ```dockerfile
  RUN rm -f tsconfig.build.tsbuildinfo
  RUN npm run build
  ```

### Problema: Tests fallan con errores de TypeScript

**Síntomas:**
- Errores como `Property 'X' has no initializer and is not definitely assigned in the constructor`
- Tests no pueden compilar debido a errores de TypeScript strict mode

**Solución:**
Se agregó el operador d(`!`) a las propiedades de DTOs y entidades que se inicializan después de la construcción:

```typescript
// Antes (causa error)
employeeId: string;

// Después (correcto)
employeeId!: string;
```

### Problema: Pods en CrashLoopBackOff en Kubernetes

**Síntomas:**
- Los pods se reinician continuamente
- Logs muestran: `Error: Cannot find module '/app/dist/main.js'`

**Causa:**
La imagen Docker no contiene los archivos JavaScript compilados.

**Solución:**
1. Verificar que el build local funcione:
   ```bash
   npm run build
   ls -la dist/main.js
   ```

2. Reconstruir la imagen Docker en el contexto de Minikube:
   ```bash
   eval $(minikube docker-env)
   docker build --no-cache -t travel-track-api:1.0.0 .
   ```

3. Reiniciar el despliegue:
   ```bash
   kubectl rollout restart deployment/travel-track-api -n travel-track
   kubectl rollout status deployment/travel-track-api -n travel-track
   ```

### Verificación Post-Despliegue

Después del deploy, verificar que todo funcione:

```bash
# 1. Verificar pods
kubectl get pods -n travel-track
# Debe mostrar pods en estado "Running"

# 2. Verificar logs
kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api
# Debe mostrar logs de inicio exitoso

# 3. Verificar servicios
kubectl get svc -n travel-track
# Debe mostrar el servicio travel-track-api

# 4. Probar endpoints
kubectl port-forward -n travel-track svc/travel-track-api 3000:80 &
curl http://localhost:3000/health
```

### Comandos Útiles para Debugging

```bash
# Ver logs en tiempo real
kubectl logs -n travel-track -l app.kubernetes.io/name=travel-track-api -f

# Ejecutar shell en el pod
kubectl exec -it -n travel-track deployment/travel-track-api -- sh

# Verificar eventos de Kubernetes
kubectl get events -n travel-track --sort-by='.lastTimestamp'

# Ver descripción detallada del pod
kubectl describe pod -n travel-track <pod-name>

# Verificar configuración del deployment
kubectl get deployment -n travel-track -o yaml
```

## 🛠️ Tecnologías

- NestJS 10
- TypeScript
- class-validator
- class-transformer
- Swagger/OpenAPI

### DevOps Stack
- Docker (multi-stage builds)
- Kubernetes
- Helm 3
- ConfigMaps para configuración
- Security contexts y resource limits

## 📁 Estructura del Proyecto

```
travel-track-entregable3/
├── src/                    # Código fuente
│   ├── config/            # Configuración centralizada
│   ├── employee/          # Módulo de empleados
│   ├── travel/            # Módulo de viajes
│   └── travel-requests/   # Módulo de solicitudes
├── helm/                   # Helm Chart
│   └── travel-track-api/
├── k8s/                    # Manifiestos K8s
├── scripts/                # Scripts de utilidad
├── Dockerfile              # Multi-stage build
└── .env.example           # Variables de entorno
```

## 📖 Documentación

- [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
- [DEVOPS.md](DEVOPS.md) - Documentación completa de DevOps
- [API Docs](http://localhost:3000/api/docs) - Documentación interactiva de la API