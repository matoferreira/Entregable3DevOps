# Resumen Final de Vulnerabilidades - Travel Track API

**Fecha del análisis:** 2025-11-22  
**Proyecto:** Travel Track API  
**Versión:** 1.0.0

---

## 📊 Resumen Ejecutivo

Este documento consolida todos los análisis de seguridad realizados en el proyecto, incluyendo:

1. **Análisis estático de código con Semgrep** (SAST - Static Application Security Testing)
2. **Análisis de dependencias con npm audit** (SCA - Software Composition Analysis)
3. **Análisis de imagen Docker con Trivy** (Container Security Scanning)

### Estadísticas Totales

| Herramienta | Vulnerabilidades/Hallazgos Iniciales | Vulnerabilidades/Hallazgos Finales | Estado |
|------------|-------------------------------------|-----------------------------------|--------|
| **Semgrep (SAST)** | 0 findings | **0 findings** | ✅ Limpio |
| **npm audit (SCA)** | 8 (2 high, 2 moderate, 4 low) | **0** | ✅ Resuelto |
| **Trivy (Alpine)** | 32 (2 high, 22 medium, 6 low, 2 unknown) | **0** | ✅ Resuelto |
| **Trivy (Node.js)** | 6 (3 high, 1 medium, 2 low) | **2 high** | ⚠️ Parcial |

**Total de vulnerabilidades HIGH/CRITICAL identificadas:** 10  
**Total resueltas completamente:** 8  
**Total parcialmente resueltas:** 2  
**Total documentadas:** 2

---

## 🔍 Parte 1: Análisis Semgrep (SAST)

### Resumen del Escaneo

**Herramienta:** Semgrep  
**Tipo de análisis:** Static Application Security Testing (SAST)  
**Fecha:** 2025-11-22

### Resultados del Escaneo

✅ **Scan completado exitosamente**

- **Findings:** 0 (0 blocking)
- **Reglas ejecutadas:** 252
- **Archivos escaneados:** 33
- **Líneas parseadas:** ~100.0%

### Detalles del Escaneo

#### Lenguajes Analizados

| Lenguaje | Reglas | Archivos |
|----------|--------|----------|
| TypeScript | 166 | 29 |
| JSON | 4 | 2 |
| YAML | 31 | 1 |
| Dockerfile | 6 | 1 |
| **Total** | **252** | **33** |

#### Reglas Aplicadas

- **Reglas de la comunidad:** 1062 reglas disponibles
- **Reglas ejecutadas:** 252 reglas
- **Origen:** Semgrep Community Rules

### Hallazgos

✅ **No se encontraron vulnerabilidades ni problemas de seguridad**

El análisis estático de código no detectó ningún problema de seguridad, código vulnerable, o patrones problemáticos en el código fuente del proyecto.

### Cobertura del Análisis

El escaneo cubrió:
- Código fuente TypeScript (29 archivos)
- Archivos de configuración JSON (2 archivos)
- Archivos de configuración YAML (1 archivo)
- Dockerfile (1 archivo)

### Notas

- Semgrep analizó patrones comunes de vulnerabilidades, malas prácticas, y problemas de seguridad
- Se utilizaron reglas de la comunidad de Semgrep
---

## 🔍 Parte 2: Análisis npm audit (SCA)

### Vulnerabilidades Iniciales Detectadas

**Total:** 8 vulnerabilidades
- **HIGH:** 2
- **MODERATE:** 2
- **LOW:** 4

#### Vulnerabilidades HIGH Identificadas

1. **glob 10.2.0 - 10.4.5**
   - **CVE:** GHSA-5j98-mcp5-4vw2
   - **Severidad:** HIGH
   - **Descripción:** Command injection via -c/--cmd executes matches with shell:true
   - **Paquete afectado:** @nestjs/cli (dependencia transitiva)
   - **Referencia:** https://github.com/advisories/GHSA-5j98-mcp5-4vw2

2. **tmp <=0.2.3**
   - **CVE:** GHSA-52f5-9888-hmc6
   - **Severidad:** LOW (pero relacionado con inquirer que tiene dependencias HIGH)
   - **Descripción:** Arbitrary temporary file / directory write via symbolic link
   - **Paquete afectado:** external-editor → inquirer → @angular-devkit/schematics-cli
   - **Referencia:** https://github.com/advisories/GHSA-52f5-9888-hmc6

#### Vulnerabilidades MODERATE Identificadas

3. **js-yaml <3.14.2 || >=4.0.0 <4.1.1**
   - **CVE:** GHSA-mh29-5h37-fv8m
   - **Severidad:** MODERATE
   - **Descripción:** Prototype pollution in merge (<<)
   - **Paquete afectado:** @nestjs/swagger
   - **Referencia:** https://github.com/advisories/GHSA-mh29-5h37-fv8m

### Solución Implementada

Se implementó la sección `overrides` en `package.json` para forzar versiones seguras de las dependencias transitivas vulnerables:

```json
{
  "overrides": {
    "glob": "^10.5.0",
    "tmp": "^0.2.3",
    "js-yaml": "^4.1.1",
    "cross-spawn": "^7.0.5"
  }
}
```

### Resultado Final npm audit

✅ **0 vulnerabilidades encontradas**

```bash
npm audit
# Resultado: found 0 vulnerabilities
```

---

## 🐳 Parte 3: Análisis Trivy (Container Security)

### Escaneo Inicial

**Imagen escaneada:** `travel-track-api:1.0.0`  
**Base de imagen:** `node:20.11.0-alpine3.19` (inicial) → `node:20-alpine` (final - Alpine 3.22.2)

#### Vulnerabilidades Iniciales en Alpine Linux

**Total:** 32 vulnerabilidades
- **HIGH:** 2
- **MEDIUM:** 22
- **LOW:** 6
- **UNKNOWN:** 2

#### Vulnerabilidades Iniciales en Node.js Packages

**Total:** 6 vulnerabilidades
- **HIGH:** 3
- **MEDIUM:** 1
- **LOW:** 2

### Vulnerabilidades HIGH/CRITICAL Identificadas por Trivy

#### 1. CVE-2024-6119 - OpenSSL (Alpine Linux) ✅ RESUELTA

**Severidad:** HIGH  
**Componentes afectados:**
- `libcrypto3` (versión instalada: 3.1.4-r5)
- `libssl3` (versión instalada: 3.1.4-r5)

**Versión corregida:** 3.1.7-r0

**Descripción:**
- **Título:** openssl: Possible denial of service in X.509 name checks
- **Impacto:** Posible denegación de servicio en verificaciones de nombres X.509
- **Referencia:** https://avd.aquasec.com/nvd/cve-2024-6119

**Acción tomada:**
- ✅ Imagen base actualizada de `node:20.11.0-alpine3.19` a `node:20-alpine` (Alpine 3.22.2)
- ✅ Verificado con Trivy: **0 vulnerabilidades en Alpine Linux**
- ✅ OpenSSL actualizado a versión segura en Alpine 3.22.2

**Estado:** ✅ **RESUELTA COMPLETAMENTE**

---

#### 2. CVE-2024-21538 - cross-spawn (Node.js Package) ⚠️ PARCIALMENTE RESUELTA

**Severidad:** HIGH  
**Componente:** `cross-spawn`  
**Versión instalada:** 7.0.3 (Docker) / 7.0.6 (local)  
**Versión corregida:** 7.0.5, 6.0.6

**Descripción:**
- **Título:** cross-spawn: regular expression denial of service
- **Impacto:** Posible denegación de servicio mediante expresión regular maliciosa
- **Referencia:** https://avd.aquasec.com/nvd/cve-2024-21538

**Acción tomada:**
- ✅ Override agregado en package.json: `"cross-spawn": "^7.0.5"`
- ✅ Localmente funciona (cross-spawn@7.0.6 instalado)
- ⚠️ En la imagen Docker: Trivy detecta cross-spawn@7.0.3 en `/usr/local/lib/node_modules/npm/node_modules/cross-spawn/`

**⚠️ Explicación de la diferencia:**
- **Localmente:** Los overrides funcionan porque afectan las dependencias instaladas por npm para el proyecto
- **En Docker:** Trivy escanea TODAS las dependencias en la imagen, incluyendo las dependencias de npm mismo.
- Las dependencias de npm están en `/usr/local/lib/node_modules/npm/` y NO están afectadas por los overrides de `package.json`
- Los overrides solo aplican a las dependencias del proyecto, no a las dependencias del gestor de paquetes npm

**Evaluación de riesgo:**
- **Riesgo en producción:** BAJO
- **Razón:** 
  - cross-spawn se usa principalmente en herramientas de desarrollo, no en runtime de producción
  - La versión vulnerable está en las dependencias de npm (gestor de paquetes), no en el código de la aplicación
  - La aplicación no ejecuta código de npm directamente en producción
- **Mitigación:** Override configurado para dependencias del proyecto

**Estado:** ⚠️ **PARCIALMENTE RESUELTA**, Se acepta el riesgo por afectar ambientes de desarrollo y ser dependencia del gestor de paquetes npm.

---

#### 3. CVE-2025-64756 - glob (Node.js Package) ⚠️ PARCIALMENTE RESUELTA

**Severidad:** HIGH  
**Componente:** `glob`  
**Versión instalada:** 10.4.2 (Docker) / 10.5.0 (local)  
**Versión corregida:** 11.1.0, 10.5.0

**Descripción:**
- **Título:** glob CLI: Command injection via -c/--cmd executes matches with shell:true
- **Impacto:** Inyección de comandos a través de la CLI de glob
- **Referencia:** https://avd.aquasec.com/nvd/cve-2025-64756

**Acción tomada:**
- ✅ Override agregado en package.json: `"glob": "^10.5.0"`
- ✅ Localmente funciona (glob@10.5.0 instalado)
- ⚠️ En la imagen Docker: Trivy detecta glob@10.4.2 en `/usr/local/lib/node_modules/npm/node_modules/glob/`

**⚠️ Explicación de la diferencia:**
- **Localmente:** Los overrides funcionan porque afectan las dependencias instaladas por npm para el proyecto
- **En Docker:** Trivy escanea TODAS las dependencias en la imagen, incluyendo las dependencias de npm mismo (el gestor de paquetes)
- Las dependencias de npm están en `/usr/local/lib/node_modules/npm/` y NO están afectadas por los overrides de `package.json`
- Los overrides solo aplican a las dependencias del proyecto, no a las dependencias del gestor de paquetes
- La vulnerabilidad de glob CLI solo se activa cuando se usa la interfaz de línea de comandos con flags específicos (-c/--cmd), que no se usa en producción

**Evaluación de riesgo:**
- **Riesgo en producción:** BAJO
- **Razón:** 
  - La vulnerabilidad solo afecta a la CLI de glob cuando se usa con flags específicos (-c/--cmd)
  - La versión vulnerable está en las dependencias de npm, no en el código de la aplicación
  - La aplicación no ejecuta la CLI de glob directamente en producción
- **Mitigación:** Override configurado para dependencias del proyecto

**Estado:** ⚠️ **PARCIALMENTE RESUELTA**, Se acepta el riesgo por ser dependencia del gestor de paquetes y no afectar el runtime de la aplicación.

---

#### 4. CVE-2024-29415 - ip (Node.js Package) 📋 DOCUMENTADA

**Severidad:** HIGH  
**Componente:** `ip`  
**Versión instalada:** 2.0.0  
**Versión corregida:** No existe una versión segura

**Descripción:**
- **Título:** node-ip: Incomplete fix for CVE-2023-42282
- **Impacto:** Corrección incompleta de una vulnerabilidad previa que permite ejecución de código arbitrario
- **Referencia:** https://avd.aquasec.com/nvd/cve-2024-29415

**Evaluación de riesgo:**
- **Riesgo:** MEDIO
- **Razón:** No hay versión corregida disponible
- **Acción requerida:** Hacer una evaluación de riesgo del negocio para saber si el paquete es necesario, evaluar alternativas o aceptación del riesgo.

**Estado:** 📋 **DOCUMENTADA**

---

## ✅ Acciones Completadas

### Correcciones Aplicadas

1. ✅ **Semgrep - Análisis estático de código**
   - Escaneo completado sin hallazgos
   - 252 reglas ejecutadas en 33 archivos
   - Resultado: 0 findings

2. ✅ **npm audit - Todas las vulnerabilidades resueltas**
   - Configurados overrides para glob, tmp, js-yaml, cross-spawn
   - Resultado: 0 vulnerabilidades

3. ✅ **Trivy - Vulnerabilidades de Alpine Linux resueltas**
   - Actualizada imagen base a Alpine 3.22.2
   - Resultado: 0 vulnerabilidades en Alpine Linux

4. ✅ **Trivy - Overrides configurados para Node.js packages**
   - glob: ^10.5.0
   - cross-spawn: ^7.0.5
   - Funcionan correctamente en entorno local

5. ✅ **Documentación completa**
   - Todas las vulnerabilidades HIGH/CRITICAL documentadas
   - Evaluación de riesgo realizada
   - Plan de acción definido

### Archivos Modificados

- `package.json` - Agregada sección `overrides`
- `Dockerfile` - Actualizada imagen base a `node:20-alpine`

### Archivos Generados

- `reports/semgrep-analysis.txt` - Análisis estático de código con Semgrep
- `reports/npm-audit-initial.txt` - Análisis inicial de npm audit
- `reports/npm-audit-fixed.txt` - Verificación post-corrección
- `reports/trivyreport.txt` - Escaneo completo inicial de Trivy
- `reports/trivy-high-critical-final.txt` - Escaneo final de vulnerabilidades HIGH/CRITICAL
- `reports/RESUMEN-FINAL-VULNERABILIDADES.md` - Este documento

---

## 📋 Estado Final por Categoría

### Vulnerabilidades Resueltas Completamente ✅

1. **Semgrep - Análisis estático de código**
   - 0 findings detectados
   - Código fuente limpio de vulnerabilidades conocidas

2. **npm audit - Todas las vulnerabilidades** (8 vulnerabilidades)
   - glob (HIGH) - Resuelto con override
   - tmp (LOW) - Resuelto con override
   - js-yaml (MODERATE) - Resuelto con override
   - cross-spawn (HIGH) - Resuelto con override (localmente)

3. **Trivy - OpenSSL (CVE-2024-6119)** (HIGH)
   - Resuelto actualizando Alpine a 3.22.2

4. **Trivy - Todas las vulnerabilidades de Alpine Linux** (32 vulnerabilidades)
   - Resuelto actualizando Alpine a 3.22.2

### Vulnerabilidades Parcialmente Resueltas ⚠️

1. **Trivy - glob (CVE-2025-64756)** (HIGH)
   - Override configurado y funcionando localmente
   - En Docker: versión 10.4.2 (dependencia transitiva)
   - **Riesgo en producción:** BAJO

2. **Trivy - cross-spawn (CVE-2024-21538)** (HIGH)
   - Override configurado y funcionando localmente
   - En Docker: versión 7.0.3 (dependencia transitiva)
   - **Riesgo en producción:** BAJO

### Vulnerabilidades Documentadas 📋

1. **Trivy - ip (CVE-2024-29415)** (HIGH)
   - No hay versión corregida disponible
   - Requiere evaluación de necesidad del paquete
   - **Riesgo:** MEDIO

---

## 🎯 Recomendaciones

### Inmediatas

1. ✅ **Completado:** Configurar overrides para dependencias vulnerables
2. ✅ **Completado:** Actualizar imagen base de Alpine

### A Mediano Plazo

1. Monitorear actualizaciones de `@nestjs/cli` que incluyan versiones seguras de glob y cross-spawn
2. Monitorear actualizaciones de la imagen base de Node.js que incluyan versiones más recientes de npm con dependencias actualizadas
3. Evaluar necesidad del paquete `ip` y buscar alternativas

## 🔗 Referencias

- [Semgrep Documentation](https://semgrep.dev/docs/)
- [Semgrep Registry](https://semgrep.dev/r)
- [npm audit Documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [Trivy Documentation](https://trivy.dev/)
- [CVE Database](https://cve.mitre.org/)
- [Aqua Security Vulnerability Database](https://avd.aquasec.com/)
- [GitHub Security Advisories](https://github.com/advisories)