#!/bin/bash

echo "🚀 Iniciando Sistema de Gestão Urbana..."
echo ""
echo "📦 Verificando pré-requisitos..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker Desktop."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados!"
echo ""
echo "🔨 Construindo e iniciando os serviços..."
echo ""

# Iniciar os serviços com Docker Compose
docker-compose up --build

# O script continuará rodando até que você pressione Ctrl+C
