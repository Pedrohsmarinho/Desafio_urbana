# 🔧 Correção do Erro Flyway - Checksum Mismatch

## ❌ Problema

O Flyway detectou que as migrations V3 e V4 foram modificadas após já terem sido aplicadas no banco de dados.

```
Migration checksum mismatch for migration version 3
Migration checksum mismatch for migration version 4
```

## ✅ Solução Rápida

Execute os comandos abaixo no seu terminal:

### Opção 1: Resetar o Banco de Dados (Recomendado para Dev)

```bash
# Conectar como superuser do PostgreSQL
sudo -u postgres psql

# Dentro do psql, execute:
DROP DATABASE IF EXISTS urbana_db;
CREATE DATABASE urbana_db;
GRANT ALL PRIVILEGES ON DATABASE urbana_db TO urbana_user;

\c urbana_db
GRANT ALL ON SCHEMA public TO urbana_user;

\q
```

### Opção 2: Repair do Flyway (Mantém os dados)

```bash
cd /home/nero/Documentos/desafio-urbana/backend

# Conectar ao banco
PGPASSWORD=urbana_pass psql -U urbana_user -d urbana_db -h localhost -p 5432

# Dentro do psql, execute:
DELETE FROM flyway_schema_history WHERE version IN ('3', '4');

\q
```

Depois, inicie o backend normalmente:

```bash
cd /home/nero/Documentos/desafio-urbana/backend
mvn spring-boot:run
```

O Flyway vai reaplicar as migrations V3 e V4 com os novos checksums.

---

## 📝 Depois de Corrigir

1. **Inicie o backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Verifique os logs** - Deve ver:
   ```
   Successfully validated 4 migrations
   Schema "public" is up to date
   ```

3. **Teste o login:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@urbana.com","senha":"admin123"}'
   ```

---

## 🎯 Por que isso aconteceu?

Durante a review, modificamos as migrations V3 e V4 para corrigir os hashes de senha. O Flyway detecta qualquer mudança em migrations já aplicadas através de checksums.

**Boas práticas para o futuro:**
- ✅ Nunca modificar migrations já aplicadas em produção
- ✅ Criar novas migrations (V5, V6, etc) para correções
- ✅ Usar Flyway repair apenas em desenvolvimento
