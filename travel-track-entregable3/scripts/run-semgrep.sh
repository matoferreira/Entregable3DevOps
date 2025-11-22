#!/bin/bash
# Script para ejecutar análisis estático con Semgrep usando Docker
# Requiere Docker Desktop ejecutándose

echo "🔍 Ejecutando análisis estático con Semgrep..."

# Verificar que Docker esté corriendo
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Crear directorio reports si no existe
mkdir -p reports

# Cambiar al directorio del proyecto
cd "$(dirname "$0")/.."

echo "📥 Descargando imagen de Semgrep (si es necesario)..."
docker pull semgrep/semgrep:latest > /dev/null 2>&1

echo "🔎 Analizando código fuente..."

# Ejecutar Semgrep y guardar resultados en texto
docker run --rm \
    -v "$(pwd):/src" \
    -w /src \
    semgrep/semgrep:latest \
    semgrep \
    --config=auto \
    src/ > reports/semgrep-analysis.txt 2>&1

EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ] || [ $EXIT_CODE -eq 1 ]; then
    echo "✅ Análisis completado: reports/semgrep-analysis.txt"
else
    echo "⚠️  Análisis completado con código de salida: $EXIT_CODE"
fi

echo ""
echo "✨ Análisis completado!"
