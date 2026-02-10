#!/bin/bash

echo "🛑 Parando Sistema de Gestão Urbana..."

# Parar e remover containers
docker-compose down

echo "✅ Serviços parados com sucesso!"
echo ""
echo "💡 Dica: Para remover também os volumes (dados do banco):"
echo "   docker-compose down -v"
