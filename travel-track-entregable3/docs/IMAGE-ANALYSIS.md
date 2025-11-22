# 📊 Análisis de Imagen Docker

Este documento describe cómo analizar y optimizar la imagen Docker de Travel Track API.

## 🔍 Herramientas de Análisis

### 1. Docker History

Muestra el tamaño de cada capa de la imagen:

```powershell
docker history travel-track-api:1.0.0 --human --no-trunc
```

**Información que proporciona:**
- Tamaño de cada capa
- Comandos que crearon cada capa
- Identificación de capas más pesadas

### 2. Docker Images

Ver el tamaño total de la imagen:

```powershell
docker images travel-track-api:1.0.0
```

### 3. Dive (Análisis Detallado)

La herramienta más completa para analizar eficiencia de imágenes Docker:

```powershell
# Ejecutar Dive
docker run --rm -it `
  -v /var/run/docker.sock:/var/run/docker.sock `
  wagoodman/dive:latest travel-track-api:1.0.0
```

**Métricas de Dive:**
- **Image Efficiency Score**: Debe ser > 85%
- **Wasted Space**: Archivos duplicados entre capas
- **Layer Details**: Contenido de cada capa

**Navegación en Dive:**
- `Tab`: Cambiar entre paneles
- `Ctrl+C`: Salir
- `Espacio`: Colapsar/expandir directorios
- `Ctrl+U`: Mostrar solo archivos modificados
- `Ctrl+A`: Mostrar archivos agregados
- `Ctrl+R`: Mostrar archivos eliminados

### 4. Container-diff

Compara dos versiones de imágenes:

```powershell
# Instalar container-diff
# Ver: https://github.com/GoogleContainerTools/container-diff

# Comparar tamaños
container-diff diff `
  daemon://travel-track-api:1.0.0 `
  daemon://travel-track-api:0.9.0 `
  --type=size

# Comparar archivos
container-diff diff `
  daemon://travel-track-api:1.0.0 `
  daemon://travel-track-api:0.9.0 `
  --type=file

# Comparar paquetes apt
container-diff diff `
  daemon://travel-track-api:1.0.0 `
  daemon://travel-track-api:0.9.0 `
  --type=apt
```

### 5. Docker Inspect

Ver configuración detallada de la imagen:

```powershell
# Información completa
docker inspect travel-track-api:1.0.0

# Solo configuración
docker inspect travel-track-api:1.0.0 --format='{{json .Config}}' | ConvertFrom-Json

# Usuario configurado
docker inspect travel-track-api:1.0.0 --format='{{.Config.User}}'

# Variables de entorno
docker inspect travel-track-api:1.0.0 --format='{{json .Config.Env}}' | ConvertFrom-Json

# Healthcheck
docker inspect travel-track-api:1.0.0 --format='{{json .Config.Healthcheck}}' | ConvertFrom-Json
```

## 📈 Métricas Esperadas

### Tamaño de Imagen

| Componente | Tamaño Esperado |
|------------|----------------|
| Imagen Base (Alpine) | ~5 MB |
| Node.js Runtime | ~40-50 MB |
| Dependencias de Producción | ~50-80 MB |
| Código Compilado | ~5-10 MB |
| **Total Esperado** | **~150-200 MB** |

### Comparación con Imagen No-Optimizada

| Aspecto | Sin Optimizar | Optimizado | Mejora |
|---------|---------------|------------|--------|
| Imagen Base | Ubuntu (~900MB) | Alpine (~5MB) | 99.4% |
| Node Modules | Dev + Prod | Solo Prod | ~40% |
| Capas | 15-20 | 10-12 | ~40% |
| Tamaño Final | ~800-1000MB | ~150-200MB | ~80% |

## 🎯 Checklist de Optimización

### ✅ Optimizaciones Implementadas

- [x] **Multi-stage build**: Separa build de runtime
- [x] **Imagen Alpine**: Base minimal Linux
- [x] **npm ci --only=production**: Solo dependencias necesarias
- [x] **npm cache clean**: Elimina cache npm
- [x] **.dockerignore**: Excluye archivos innecesarios
- [x] **Combinar comandos RUN**: Reduce número de capas
- [x] **Orden de COPY**: Aprovecha cache de Docker

### 🔐 Seguridad

- [x] Usuario no-root (nestjs:1001)
- [x] Versiones específicas (no latest)
- [x] Minimal attack surface (Alpine)
- [x] dumb-init para manejo de señales
- [x] Healthcheck configurado

## 📊 Script de Análisis Completo

```powershell
# Guardar este script como analyze-image.ps1

param(
    [string]$ImageTag = "1.0.0"
)

$IMAGE = "travel-track-api:${ImageTag}"

Write-Host "🔍 Análisis Completo de Imagen Docker" -ForegroundColor Cyan
Write-Host "Imagen: $IMAGE" -ForegroundColor White
Write-Host ""

# 1. Tamaño total
Write-Host "📦 TAMAÑO DE IMAGEN" -ForegroundColor Yellow
docker images $IMAGE --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
Write-Host ""

# 2. Historial de capas
Write-Host "📋 CAPAS DE LA IMAGEN (Top 10 más grandes)" -ForegroundColor Yellow
docker history $IMAGE --human --no-trunc | Select-Object -First 11
Write-Host ""

# 3. Configuración de usuario
Write-Host "👤 CONFIGURACIÓN DE SEGURIDAD" -ForegroundColor Yellow
$user = docker inspect $IMAGE --format='{{.Config.User}}'
Write-Host "  Usuario: $user"

$workdir = docker inspect $IMAGE --format='{{.Config.WorkingDir}}'
Write-Host "  WorkDir: $workdir"
Write-Host ""

# 4. Variables de entorno
Write-Host "🔧 VARIABLES DE ENTORNO" -ForegroundColor Yellow
docker inspect $IMAGE --format='{{range .Config.Env}}{{println .}}{{end}}'
Write-Host ""

# 5. Healthcheck
Write-Host "💚 HEALTHCHECK" -ForegroundColor Yellow
$healthcheck = docker inspect $IMAGE --format='{{.Config.Healthcheck}}'
if ($healthcheck -ne "<nil>") {
    Write-Host "  Configurado: ✓" -ForegroundColor Green
} else {
    Write-Host "  Configurado: ✗" -ForegroundColor Red
}
Write-Host ""

# 6. Análisis con Dive (si está disponible)
Write-Host "🔬 ANÁLISIS DETALLADO CON DIVE" -ForegroundColor Yellow
Write-Host "Ejecuta el siguiente comando para análisis interactivo:" -ForegroundColor Gray
Write-Host "docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive:latest $IMAGE" -ForegroundColor White
Write-Host ""

# 7. Escaneo de seguridad
Write-Host "🔐 ESCANEO DE SEGURIDAD" -ForegroundColor Yellow
Write-Host "Ejecutando Trivy..." -ForegroundColor Gray
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock `
    aquasec/trivy:latest image $IMAGE --severity HIGH,CRITICAL
```

## 🎓 Interpretación de Resultados

### Dive - Image Efficiency Score

- **95-100%**: Excelente, imagen muy optimizada
- **85-94%**: Buena, optimización aceptable
- **70-84%**: Regular, hay espacio para mejorar
- **< 70%**: Pobre, requiere optimización

### Capas de Imagen

**Buenas prácticas:**
- Menos capas = mejor (10-15 capas típicas)
- Capas grandes al inicio (base, dependencias)
- Capas pequeñas al final (código)
- Aprovechar cache en capas que cambian poco

### Wasted Space

**Causas comunes:**
- Archivos eliminados en capas superiores
- Dependencias duplicadas
- Cache no limpiado
- Archivos temporales

**Soluciones:**
- Combinar comandos en un solo RUN
- Limpiar cache en la misma capa
- Usar multi-stage builds

## 📚 Referencias

- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Dive GitHub](https://github.com/wagoodman/dive)
- [Container-diff](https://github.com/GoogleContainerTools/container-diff)
- [Trivy](https://aquasecurity.github.io/trivy/)

## 🔄 Proceso de Optimización

1. **Construir** imagen inicial
2. **Analizar** con dive y docker history
3. **Identificar** capas grandes o redundantes
4. **Optimizar** Dockerfile
5. **Re-construir** y comparar
6. **Repetir** hasta alcanzar métricas objetivo

## 📊 Ejemplo de Reporte

```
========================================
REPORTE DE ANÁLISIS - travel-track-api:1.0.0
========================================

Tamaño Total: 178 MB
Efficiency Score: 92%
Wasted Space: 4.2 MB (2.4%)
Total Layers: 11

Top 5 Capas más grandes:
1. Node.js base (Alpine) - 48 MB
2. Dependencias npm - 72 MB
3. Código compilado - 8 MB
4. dumb-init - 1.2 MB
5. Usuario y permisos - 0.5 MB

Seguridad:
✓ Usuario no-root: nestjs (1001)
✓ Imagen base: node:20.11.0-alpine3.19
✓ Sin vulnerabilidades CRITICAL
△ 2 vulnerabilidades HIGH (en análisis)

Recomendaciones:
- Imagen bien optimizada
- Considerar actualizar dependencias con vulnerabilidades
- Monitorear tamaño en futuras versiones
```
