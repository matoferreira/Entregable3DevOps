# Políticas de Kyverno - Travel Track API

Este directorio contiene las políticas de seguridad de Kyverno para el namespace `travel-track`.

## Políticas Implementadas

### 1. disallow-latest-tag.yaml
**Objetivo:** Prohibir el uso de imágenes con la etiqueta `latest`

**Descripción:**
- Requiere que todas las imágenes usen tags específicos (no `latest`)
- Aplica a todos los Pods en el namespace `travel-track`
- Modo: `enforce` (bloquea despliegues no conformes)

**Aplicación:**
```bash
kubectl apply -f k8s/kyverno-policies/disallow-latest-tag.yaml
```

### 2. require-resource-limits.yaml
**Objetivo:** Exigir límites y solicitudes de recursos en todos los pods

**Descripción:**
- Requiere que todos los contenedores tengan `requests` y `limits` para CPU y memoria
- Aplica a todos los Pods en el namespace `travel-track`
- Modo: `enforce` (bloquea despliegues no conformes)

**Aplicación:**
```bash
kubectl apply -f k8s/kyverno-policies/require-resource-limits.yaml
```

### 3. disallow-root-user.yaml
**Objetivo:** Impedir la ejecución de contenedores como root

**Descripción:**
- Requiere que los contenedores se ejecuten como usuario no-root
- Requiere `runAsNonRoot: true` y `runAsUser` mayor que 0
- Aplica a todos los Pods en el namespace `travel-track`
- Modo: `enforce` (bloquea despliegues no conformes)

**Aplicación:**
```bash
kubectl apply -f k8s/kyverno-policies/disallow-root-user.yaml
```

## Validación de Políticas

### Aplicar todas las políticas
```bash
kubectl apply -f k8s/kyverno-policies/
```

### Verificar estado de las políticas
```bash
kubectl get clusterpolicies
```

### Probar con un Pod no conforme
Se ha creado un manifiesto de prueba que viola las tres políticas:

```bash
# Intentar desplegar el Pod no conforme (debe fallar)
kubectl apply -f k8s/test-non-compliant-pod.yaml
```

Este Pod viola:
1. ✅ Usa `nginx:latest` (viola política de tags)
2. ✅ No tiene límites de recursos (viola política de recursos)
3. ✅ No especifica `runAsNonRoot` (viola política de root)

### Ver eventos de Kyverno
```bash
kubectl get events -n travel-track --sort-by='.lastTimestamp'
```

## Notas

- Las políticas están configuradas para el namespace `travel-track`
- Las políticas usan `validationFailureAction: enforce` para bloquear recursos no conformes
- `background: true` permite que Kyverno evalúe recursos existentes

