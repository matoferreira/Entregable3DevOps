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

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
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

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

UNLICENSED - Uso académico
