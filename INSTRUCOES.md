# 📖 Instruções de Instalação e Execução

## 🎯 Guia Rápido

### Pré-requisitos

Certifique-se de ter instalado:
- Docker Desktop (versão mais recente)
- Git
- (Opcional) Java 17 e Node.js 20 para execução local

### Passos para Execução

#### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd desafio-urbana
```

#### 2. Execute com Docker Compose
```bash
docker-compose up --build
```

Este comando irá:
- ⬇️ Baixar as imagens necessárias
- 🔨 Compilar o backend Java
- 📦 Instalar dependências do frontend
- 🗄️ Criar e configurar o banco PostgreSQL
- 🚀 Iniciar todos os serviços

#### 3. Aguarde a Inicialização

A primeira execução pode levar alguns minutos. Aguarde até ver:
```
backend    | Started DesafioUrbanaApplication
frontend   | Compiled successfully
postgres   | database system is ready to accept connections
```

#### 4. Acesse a Aplicação

Abra seu navegador e acesse:
- 🌐 **Frontend:** http://localhost:4200
- 🔌 **API Backend:** http://localhost:8080/api
- 📚 **Swagger:** http://localhost:8080/api/swagger-ui.html

#### 5. Faça Login

Use uma das credenciais de teste:

**Administrador:**
- Email: `admin@urbana.com`
- Senha: `admin123`

**Usuário:**
- Email: `user@urbana.com`
- Senha: `user123`

## 🔧 Comandos Úteis

### Parar os Serviços
```bash
docker-compose down
```

### Parar e Remover Volumes (limpar dados)
```bash
docker-compose down -v
```

### Ver Logs
```bash
# Todos os serviços
docker-compose logs -f

# Backend apenas
docker-compose logs -f backend

# Frontend apenas
docker-compose logs -f frontend

# PostgreSQL apenas
docker-compose logs -f postgres
```

### Reconstruir Imagens
```bash
docker-compose up --build --force-recreate
```

## 🐛 Resolução de Problemas

### Porta já em uso
Se alguma porta (4200, 8080, 5432) estiver em uso:

1. Pare o serviço que está usando a porta, OU
2. Edite o `docker-compose.yml` para usar outras portas

### Erro de conexão com o banco
Se o backend não conseguir conectar ao banco:

1. Aguarde mais alguns segundos (o banco pode estar iniciando)
2. Verifique os logs: `docker-compose logs postgres`
3. Reinicie: `docker-compose restart backend`

### Erro ao compilar o backend
```bash
# Limpe e reconstrua
docker-compose down
docker-compose up --build backend
```

### Erro no frontend
```bash
# Limpe node_modules e reconstrua
docker-compose down
docker volume rm desafio-urbana_node_modules
docker-compose up --build frontend
```

## 🔍 Verificação de Saúde

### Verificar se o backend está rodando
```bash
curl http://localhost:8080/api/swagger-ui.html
```

### Verificar se o banco está rodando
```bash
docker-compose exec postgres psql -U urbana_user -d urbana_db -c "\dt"
```

### Verificar se o frontend está rodando
Acesse: http://localhost:4200

## 📊 Testando a API

### Usando Swagger UI
1. Acesse: http://localhost:8080/api/swagger-ui.html
2. Clique em "auth-controller"
3. Expanda POST /auth/login
4. Clique em "Try it out"
5. Use as credenciais de teste
6. Clique em "Execute"
7. Copie o token da resposta
8. Clique em "Authorize" (cadeado no topo)
9. Cole: `Bearer {seu-token}`
10. Agora você pode testar todos os endpoints!

### Usando cURL

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@urbana.com","senha":"admin123"}'
```

**Listar Usuários:**
```bash
# Substitua {TOKEN} pelo token recebido no login
curl -X GET http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer {TOKEN}"
```

## 🎓 Testando o Frontend

1. **Login:** Acesse http://localhost:4200
2. **Dashboard:** Visualize estatísticas
3. **Usuários:** Navegue para /usuarios
   - Crie um novo usuário (apenas Admin)
   - Edite um usuário existente
   - Visualize cartões de um usuário
4. **Cartões:** Navegue para /cartoes
   - Visualize todos os cartões
   - Ative/Desative cartões
   - Filtre por tipo

## 💡 Dicas

### Desenvolvimento Local (sem Docker)

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**Banco de Dados:**
```bash
# Crie manualmente ou use Docker apenas para o banco
docker run --name urbana-postgres \
  -e POSTGRES_DB=urbana_db \
  -e POSTGRES_USER=urbana_user \
  -e POSTGRES_PASSWORD=urbana_pass \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Acessar o Banco de Dados

```bash
docker-compose exec postgres psql -U urbana_user -d urbana_db
```

Comandos úteis do PostgreSQL:
```sql
-- Listar tabelas
\dt

-- Ver estrutura de uma tabela
\d usuarios
\d cartoes

-- Consultar dados
SELECT * FROM usuarios;
SELECT * FROM cartoes;

-- Ver logs do Flyway
SELECT * FROM flyway_schema_history;

-- Sair
\q
```

## 📈 Monitoramento

### Verificar uso de recursos
```bash
docker stats
```

### Ver processos rodando
```bash
docker-compose ps
```

## 🔄 Atualização

Se você fizer alterações no código:

**Backend:**
```bash
docker-compose up --build backend
```

**Frontend:**
```bash
docker-compose up --build frontend
```

## ✅ Checklist de Verificação

Antes de considerar que tudo está funcionando:

- [ ] Docker Compose subiu sem erros
- [ ] Acesso ao frontend (http://localhost:4200)
- [ ] Login funciona com credenciais de teste
- [ ] Dashboard exibe estatísticas
- [ ] É possível listar usuários
- [ ] É possível listar cartões
- [ ] Swagger está acessível (http://localhost:8080/api/swagger-ui.html)
- [ ] É possível fazer login via Swagger
- [ ] Endpoints retornam dados corretos

## 🆘 Ajuda Adicional

Se ainda tiver problemas:

1. Verifique se o Docker Desktop está rodando
2. Verifique se há espaço em disco suficiente
3. Tente reiniciar o Docker Desktop
4. Verifique os logs detalhados de cada serviço
5. Consulte o README.md principal

---

🎉 **Pronto! Agora você pode começar a explorar o sistema!** 🎉
