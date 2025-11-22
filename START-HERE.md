# 🚀 EMPEZAR AQUÍ

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Instalar Dependencias
```powershell
npm install
```
Este comando instalará todas las dependencias necesarias incluyendo `@nestjs/config`.

### Paso 2: Configurar Variables de Entorno
```powershell
Copy-Item .env.example .env
```

### Paso 3: Ejecutar en Desarrollo
```powershell
npm run start:dev
```
La aplicación estará disponible en http://localhost:3000/api/docs

---

## 🐳 Construir Imagen Docker

```powershell
# Opción fácil: Usar el script
.\scripts\build-image.ps1

# Opción manual
docker build -t travel-track-api:1.0.0 .
```

## 📊 Analizar la Imagen

```powershell
# Análisis completo
.\scripts\analyze-image.ps1

# Escaneo de seguridad
.\scripts\security-scan.ps1

# Análisis con Dive (interactivo)
docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive:latest travel-track-api:1.0.0
```

## ☸️ Desplegar en Kubernetes

```powershell
# Con el script helper
.\scripts\deploy-helm.ps1

# Manual
helm install travel-track-api ./helm/travel-track-api

# Acceder al servicio
kubectl port-forward -n travel-track svc/travel-track-api 3000:80
```

---

## 📚 Documentación Completa

- **[QUICKSTART.md](QUICKSTART.md)** - Guía paso a paso
- **[DEVOPS.md](DEVOPS.md)** - Documentación completa de DevOps
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Resumen de lo implementado
- **[docs/IMAGE-ANALYSIS.md](docs/IMAGE-ANALYSIS.md)** - Guía de análisis de imagen

## 🎯 Comandos Más Usados

```powershell
# Ver todos los comandos disponibles
.\make.ps1 help

# Desarrollo
.\make.ps1 install          # Instalar dependencias
.\make.ps1 dev              # Modo desarrollo
.\make.ps1 test             # Ejecutar tests

# Docker
.\make.ps1 docker-build     # Construir imagen
.\make.ps1 docker-run       # Ejecutar contenedor
.\make.ps1 analyze          # Analizar tamaño

# Kubernetes
.\make.ps1 k8s-deploy       # Desplegar
.\make.ps1 k8s-status       # Ver estado
.\make.ps1 k8s-logs         # Ver logs
```

## ✅ Cumplimiento de Requisitos

### ✓ Configuración Externa
- Variables de entorno en `.env`
- ConfigMaps para Kubernetes
- Sin valores hardcodeados

### ✓ Docker
- Multi-stage build optimizado
- Usuario no-root (nestjs:1001)
- Imagen Alpine minimal
- Versión específica: 1.0.0

### ✓ Kubernetes + Helm
- Namespace exclusivo: `travel-track`
- Resources limits y requests
- Service ClusterIP
- Helm Chart completo

## 🆘 ¿Problemas?

1. **Error de módulos no encontrados**: Ejecuta `npm install`
2. **Docker no funciona**: Asegúrate de que Docker Desktop esté ejecutándose
3. **Kubernetes no disponible**: Habilita Kubernetes en Docker Desktop
4. **Helm no instalado**: Instala con `choco install kubernetes-helm`

---

**¡Listo para empezar! 🎉**

Si es tu primera vez, te recomendamos seguir [QUICKSTART.md](QUICKSTART.md) para una guía completa.
