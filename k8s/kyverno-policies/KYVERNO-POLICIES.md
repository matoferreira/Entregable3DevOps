# Políticas de Seguridad Kyverno - Travel Track API

**Fecha de implementación:** 2025-11-22  
**Namespace objetivo:** travel-track

---

## 📋 Resumen

Se han implementado **3 políticas de seguridad** usando Kyverno para garantizar mejores prácticas y seguridad en el despliegue de aplicaciones en Kubernetes.

---

## 🔒 Políticas Implementadas

### 1. Prohibir Imágenes con Tag `latest`

**Archivo:** `disallow-latest-tag.yaml`  
**Tipo:** ClusterPolicy  
**Severidad:** Medium

**Objetivo:**
Prohibir el uso de imágenes Docker con la etiqueta `latest` para garantizar que se usen versiones específicas y rastreables.

**Configuración:**
- **Modo:** `enforce` (bloquea recursos no conformes)
- **Background:** `true` (evalúa recursos existentes)
- **Scope:** Todos los Pods en el namespace `travel-track`

**Validación:**
```yaml
pattern:
  spec:
    containers:
    - name: "*"
      image: "!*:latest"
```

**Mensaje de error:**
> "Using 'latest' tag is not allowed. Please use a specific version tag."

**Ejemplo de violación:**
```yaml
containers:
- name: app
  image: nginx:latest  # ❌ Será rechazado
```

**Ejemplo correcto:**
```yaml
containers:
- name: app
  image: nginx:1.25.3  # ✅ Aceptado
```

---

### 2. Exigir Límites y Solicitudes de Recursos

**Archivo:** `require-resource-limits.yaml`  
**Tipo:** ClusterPolicy  
**Severidad:** Medium

**Objetivo:**
Garantizar que todos los contenedores tengan definidos `requests` y `limits` para CPU y memoria, previniendo agotamiento de recursos y asegurando asignación justa.

**Configuración:**
- **Modo:** `enforce` (bloquea recursos no conformes)
- **Background:** `true` (evalúa recursos existentes)
- **Scope:** Todos los Pods en el namespace `travel-track`

**Validación:**
```yaml
pattern:
  spec:
    containers:
    - name: "*"
      resources:
        requests:
          memory: "?*"
          cpu: "?*"
        limits:
          memory: "?*"
          cpu: "?*"
```

**Mensaje de error:**
> "Resource requests and limits are required for all containers."

**Ejemplo de violación:**
```yaml
containers:
- name: app
  image: nginx:1.25.3
  # ❌ Falta resources - será rechazado
```

**Ejemplo correcto:**
```yaml
containers:
- name: app
  image: nginx:1.25.3
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "256Mi"
      cpu: "200m"  # ✅ Aceptado
```

---

### 3. Impedir Ejecución como Root

**Archivo:** `disallow-root-user.yaml`  
**Tipo:** ClusterPolicy  
**Severidad:** High

**Objetivo:**
Forzar que todos los contenedores se ejecuten como usuario no-root, siguiendo el principio de menor privilegio.

**Configuración:**
- **Modo:** `enforce` (bloquea recursos no conformes)
- **Background:** `true` (evalúa recursos existentes)
- **Scope:** Todos los Pods en el namespace `travel-track`

**Validación:**
```yaml
pattern:
  spec:
    =(securityContext):
      =(runAsNonRoot): "true"
    containers:
    - name: "*"
      =(securityContext):
        =(runAsNonRoot): "true"
        =(runAsUser): ">0"
```

**Mensaje de error:**
> "Running as root user is not allowed. Containers must run as non-root."

**Ejemplo de violación:**
```yaml
containers:
- name: app
  image: nginx:1.25.3
  # ❌ No especifica runAsNonRoot - será rechazado
```

**Ejemplo correcto:**
```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
  containers:
  - name: app
    image: nginx:1.25.3
    securityContext:
      runAsNonRoot: true
      runAsUser: 1001  # ✅ Aceptado
```

---

## 🧪 Validación de Funcionamiento

### Pod de Prueba No Conforme

Se creó un manifiesto de prueba (`test-non-compliant-pod.yaml`) que viola las tres políticas:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-non-compliant-pod
  namespace: travel-track
spec:
  containers:
  - name: test-container
    image: nginx:latest  # ❌ Violación 1: tag latest
    # ❌ Violación 2: sin límites de recursos
    # ❌ Violación 3: sin runAsNonRoot
    ports:
    - containerPort: 80
```

### Comandos para Validar

1. **Aplicar las políticas:**
```bash
kubectl apply -f k8s/kyverno-policies/
```

2. **Verificar que las políticas están activas:**
```bash
kubectl get clusterpolicies
```

3. **Intentar desplegar el Pod no conforme (debe fallar):**
```bash
kubectl apply -f k8s/test-non-compliant-pod.yaml
```

**Resultado esperado:**
```
Error from server: error when creating "k8s/test-non-compliant-pod.yaml":
admission webhook "validate.kyverno.svc" denied the request:

policy disallow-latest-tag/check-image-tag: Using 'latest' tag is not allowed.
policy require-resource-limits/check-resource-requests: Resource requests and limits are required.
policy disallow-root-user/check-run-as-non-root: Running as root user is not allowed.
```

4. **Ver eventos de Kyverno:**
```bash
kubectl get events -n travel-track --sort-by='.lastTimestamp'
```

---

## 📊 Estado de Cumplimiento

### Deployment Actual (travel-track-api)

El deployment actual en `k8s/deployment.yaml` **cumple con las tres políticas**:

✅ **Tag específico:** `travel-track-api:1.0.0` (no usa `latest`)  
✅ **Recursos definidos:**
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "256Mi"
    cpu: "200m"
```
✅ **Usuario no-root:**
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
```

---

## 🔧 Instalación y Configuración

### Prerequisitos

1. **Kyverno instalado en el cluster:**
```bash
# Instalar Kyverno (si no está instalado)
kubectl create -f https://github.com/kyverno/kyverno/releases/latest/download/install.yaml
```

2. **Verificar instalación:**
```bash
kubectl get pods -n kyverno
```

### Aplicar Políticas

```bash
# Aplicar todas las políticas
kubectl apply -f k8s/kyverno-policies/

# Verificar estado
kubectl get clusterpolicies
```

### Personalización

Para aplicar las políticas a otros namespaces, modificar el campo `namespaces` en cada política:

```yaml
match:
  any:
  - resources:
      kinds:
        - Pod
      namespaces:
        - "travel-track"  # Cambiar aquí
```

---

## 📝 Notas Adicionales

- Las políticas usan `validationFailureAction: enforce` para **bloquear** recursos no conformes
- `background: true` permite que Kyverno evalúe recursos existentes en el cluster
- Las políticas son **ClusterPolicy**, aplicables a nivel de cluster
- Para políticas específicas de namespace, usar `Policy` en lugar de `ClusterPolicy`

---

## 🔗 Referencias

- [Kyverno Documentation](https://kyverno.io/docs/)
- [Kyverno Policies](https://kyverno.io/policies/)
- [Kubernetes Security Best Practices](https://kubernetes.io/docs/concepts/security/)

