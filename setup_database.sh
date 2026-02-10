#!/bin/bash

# Script para configurar o banco de dados PostgreSQL local

echo "🗄️  Configurando banco de dados PostgreSQL local..."
echo ""

# Criar usuário e banco de dados
sudo -u postgres psql << EOF
-- Criar banco de dados
CREATE DATABASE urbana_db;

-- Criar usuário
CREATE USER urbana_user WITH ENCRYPTED PASSWORD 'urbana_pass';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE urbana_db TO urbana_user;

-- PostgreSQL 15+ requer permissão adicional no schema public
\c urbana_db
GRANT ALL ON SCHEMA public TO urbana_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO urbana_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO urbana_user;

-- Verificar
\l urbana_db
\du urbana_user
EOF

echo ""
echo "✅ Banco de dados configurado com sucesso!"
echo ""
echo "📝 Credenciais:"
echo "   Database: urbana_db"
echo "   User: urbana_user"
echo "   Password: urbana_pass"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "🚀 Agora você pode iniciar o backend:"
echo "   cd backend"
echo "   mvn spring-boot:run"
