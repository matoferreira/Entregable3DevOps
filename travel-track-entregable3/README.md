# Travel Requests API

API REST para gestionar solicitudes de viaje corporativo de TravelTrack. Desarrollada con NestJS y TypeScript.

## Descripción

Microservicio HTTP que permite crear, consultar, aprobar y rechazar solicitudes de viaje de empleados.

## Requisitos

- Node.js v18 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start

# Modo desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run start:prod
```

La aplicación se ejecutará por defecto en `http://localhost:3000`

## Documentación API

Una vez iniciada la aplicación, accede a la documentación Swagger en:

```
http://localhost:3000/api/docs
```

## Endpoints disponibles

### Health Check
- `GET /health` - Verifica el estado del servicio

### Travel Requests
- `POST /travel-requests` - Crear nueva solicitud de viaje
- `GET /travel-requests` - Obtener todas las solicitudes
- `PATCH /travel-requests/:id/approve` - Aprobar una solicitud
- `PATCH /travel-requests/:id/reject` - Rechazar una solicitud

### Ejemplo de uso

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

## Variables de entorno

- `PORT` - Puerto en el que se ejecuta la aplicación (default: 3000)

## Tecnologías

- NestJS 10
- TypeScript
- class-validator
- class-transformer
- Swagger/OpenAPI

