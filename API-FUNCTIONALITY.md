# 🎯 Funcionalidad de la Aplicación

## Descripción General

Travel Track API es un sistema completo de gestión de viajes corporativos que permite:
- Gestionar empleados
- Planificar viajes
- Crear y aprobar/rechazar solicitudes de viaje

## 🚀 Datos de Ejemplo Precargados

Al iniciar la aplicación, se crean automáticamente datos de ejemplo:

### 👥 Empleados (4)
1. Juan Pérez - juan.perez@traveltrack.com
2. María García - maria.garcia@traveltrack.com
3. Carlos Rodríguez - carlos.rodriguez@traveltrack.com
4. Ana Martínez - ana.martinez@traveltrack.com

### ✈️ Viajes Planificados (3)
1. Barcelona - 4 días (Juan Pérez)
2. Madrid - 2 días (María García)
3. Valencia - 2 días (Carlos Rodríguez)

### 📝 Solicitudes de Viaje (4)
1. París - 4 días (Juan Pérez) - **APROBADA** ✅
2. Londres - 3 días (María García) - **PENDIENTE** ⏳
3. Berlín - 5 días (Carlos Rodríguez) - **RECHAZADA** ❌
4. Ámsterdam - 2 días (Ana Martínez) - **PENDIENTE** ⏳

## 📡 API Endpoints

### General
- `GET /` - Bienvenida de la API
- `GET /health` - Estado del servicio (incluye versión, entorno, etc.)

### Empleados (`/employee`)
- `POST /employee` - Crear nuevo empleado
- `GET /employee` - Listar todos los empleados
- `GET /employee/:id` - Obtener empleado por ID
- `PUT /employee/:id` - Actualizar empleado
- `DELETE /employee/:id` - Eliminar empleado

### Viajes (`/travels`)
- `POST /travels` - Crear nuevo viaje
- `GET /travels` - Listar todos los viajes

### Solicitudes de Viaje (`/travel-requests`)
- `POST /travel-requests` - Crear nueva solicitud
- `GET /travel-requests` - Listar todas las solicitudes
- `PATCH /travel-requests/:id/approve` - Aprobar solicitud
- `PATCH /travel-requests/:id/reject` - Rechazar solicitud

## 🧪 Probar la API

### 1. Iniciar la aplicación
```bash
npm run start:dev
```

### 2. Acceder a la documentación Swagger
Abre tu navegador en: http://localhost:3000/api/docs

### 3. Ejemplos de uso

#### Listar todos los empleados
```bash
curl http://localhost:3000/employee
```

#### Listar todas las solicitudes de viaje
```bash
curl http://localhost:3000/travel-requests
```

#### Ver estado del servicio
```bash
curl http://localhost:3000/health
```

#### Crear un nuevo empleado
```bash
curl -X POST http://localhost:3000/employee \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro López",
    "email": "pedro.lopez@traveltrack.com",
    "phone": "+34 656 789 012"
  }'
```

#### Crear una solicitud de viaje
```bash
# Primero obtén el ID de un empleado de GET /employee
curl -X POST http://localhost:3000/travel-requests \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMPLOYEE_ID_AQUI",
    "destination": "Roma",
    "days": 6
  }'
```

#### Aprobar una solicitud
```bash
# Usa el ID de una solicitud PENDIENTE
curl -X PATCH http://localhost:3000/travel-requests/REQUEST_ID_AQUI/approve
```

## 🎨 Swagger UI

La documentación interactiva está disponible en `/api/docs` y permite:
- Ver todos los endpoints disponibles
- Probar las APIs directamente desde el navegador
- Ver los esquemas de datos
- Ver ejemplos de request/response

## 💾 Almacenamiento

Los datos se almacenan **en memoria** durante la ejecución de la aplicación. Esto significa que:
- Los datos se pierden al reiniciar el servidor
- Ideal para desarrollo y testing
- No requiere configuración de base de datos

## 🔄 Flujo de Trabajo Típico

1. **Crear empleados** (o usar los precargados)
2. **Crear solicitudes de viaje** para un empleado
3. **Aprobar o rechazar** las solicitudes
4. **Planificar viajes** basados en solicitudes aprobadas

## 🌍 Variables de Entorno

La aplicación responde a estas variables (ver `.env`):
- `NODE_ENV` - Entorno (development/production)
- `PORT` - Puerto del servidor (default: 3000)
- `APP_VERSION` - Versión de la aplicación
- `APP_NAME` - Nombre de la aplicación
- `LOG_LEVEL` - Nivel de logs

## 📦 Modelos de Datos

### Employee
```typescript
{
  id: string,
  name: string,
  email: string,
  phone: string
}
```

### Travel
```typescript
{
  id: string,
  employeeId: string,
  destination: string,
  days: number,
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED',
  createdAt: Date
}
```

### TravelRequest
```typescript
{
  id: string,
  employeeId: string,
  destination: string,
  days: number,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  createdAt: Date,
  approvedAt?: Date
}
```

## 🎓 Casos de Uso

### Caso 1: Solicitar un viaje
1. El empleado crea una solicitud de viaje
2. El manager revisa la solicitud en el sistema
3. El manager aprueba o rechaza la solicitud

### Caso 2: Planificar un viaje
1. Una solicitud ha sido aprobada
2. Se crea un viaje oficial con los detalles
3. El viaje queda registrado en el sistema

### Caso 3: Consultar viajes de un empleado
1. Se busca el ID del empleado
2. Se filtran los viajes por ese employeeId
3. Se obtiene el historial completo

## 🚀 Próximos Pasos

Para una aplicación de producción, considera agregar:
- Base de datos persistente (PostgreSQL, MongoDB, etc.)
- Autenticación y autorización (JWT)
- Validación de roles (empleado vs manager)
- Notificaciones por email
- Reportes y estadísticas
- Integración con sistemas de reservas

## 📚 Más Información

- Ver `DEVOPS.md` para configuración de despliegue
- Ver `QUICKSTART.md` para inicio rápido
- Acceder a `/api/docs` para documentación interactiva
