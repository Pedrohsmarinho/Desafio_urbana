# 🌐 Documentação de Endpoints da API

Base URL: `http://localhost:8080/api`

## 🔐 Autenticação

### POST /auth/login
Realiza login e retorna token JWT.

**Request Body:**
```json
{
  "email": "admin@urbana.com",
  "senha": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tipo": "Bearer",
  "id": 1,
  "nome": "Administrador",
  "email": "admin@urbana.com",
  "role": "ROLE_ADMIN"
}
```

### POST /auth/registrar
Registra novo usuário no sistema.

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "ROLE_USER",
  "ativo": true,
  "dataCriacao": "2024-01-15T10:30:00",
  "cartoes": []
}
```

---

## 👥 Usuários

> **Nota:** Todos os endpoints de usuários requerem autenticação (token JWT no header Authorization).

### GET /usuarios
Lista todos os usuários.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@urbana.com",
    "role": "ROLE_ADMIN",
    "ativo": true,
    "dataCriacao": "2024-01-01T00:00:00",
    "cartoes": []
  },
  {
    "id": 2,
    "nome": "Usuário Teste",
    "email": "user@urbana.com",
    "role": "ROLE_USER",
    "ativo": true,
    "dataCriacao": "2024-01-01T00:00:00",
    "cartoes": [...]
  }
]
```

### GET /usuarios/ativos
Lista apenas usuários ativos.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Mesmo formato da listagem completa.

### GET /usuarios/{id}
Busca usuário específico por ID.

**Path Parameters:**
- `id` (Long): ID do usuário

**Response (200 OK):**
```json
{
  "id": 2,
  "nome": "Usuário Teste",
  "email": "user@urbana.com",
  "role": "ROLE_USER",
  "ativo": true,
  "dataCriacao": "2024-01-01T00:00:00",
  "dataAtualizacao": null,
  "cartoes": [
    {
      "id": 1,
      "numeroCartao": 1001001001,
      "nome": "Cartão Principal",
      "status": true,
      "tipoCartao": "COMUM"
    }
  ]
}
```

### POST /usuarios
Cria novo usuário (Requer ROLE_ADMIN).

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "senha123",
  "role": "ROLE_USER"
}
```

**Response (201 Created):**
```json
{
  "id": 4,
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "role": "ROLE_USER",
  "ativo": true,
  "dataCriacao": "2024-01-15T10:45:00",
  "cartoes": []
}
```

### PUT /usuarios/{id}
Atualiza dados do usuário.

**Path Parameters:**
- `id` (Long): ID do usuário

**Request Body:** (todos os campos são opcionais)
```json
{
  "nome": "Maria Santos Silva",
  "email": "maria.silva@email.com",
  "senha": "novaSenha123"
}
```

**Response (200 OK):**
```json
{
  "id": 4,
  "nome": "Maria Santos Silva",
  "email": "maria.silva@email.com",
  "role": "ROLE_USER",
  "ativo": true,
  "dataCriacao": "2024-01-15T10:45:00",
  "dataAtualizacao": "2024-01-15T11:00:00",
  "cartoes": []
}
```

### DELETE /usuarios/{id}
Inativa usuário (soft delete).

**Path Parameters:**
- `id` (Long): ID do usuário

**Response:** 204 No Content

### DELETE /usuarios/{id}/permanente
Remove usuário permanentemente (Requer ROLE_ADMIN).

**Path Parameters:**
- `id` (Long): ID do usuário

**Response:** 204 No Content

---

## 💳 Cartões

> **Nota:** Todos os endpoints de cartões requerem autenticação.

### GET /cartoes
Lista todos os cartões.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "numeroCartao": 1001001001,
    "nome": "Cartão Principal",
    "status": true,
    "tipoCartao": "COMUM",
    "usuarioId": 2,
    "usuarioNome": "Usuário Teste",
    "dataCriacao": "2024-01-01T00:00:00"
  }
]
```

### GET /cartoes/ativos
Lista apenas cartões ativos.

**Response:** Mesmo formato da listagem completa.

### GET /cartoes/{id}
Busca cartão específico por ID.

**Path Parameters:**
- `id` (Long): ID do cartão

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroCartao": 1001001001,
  "nome": "Cartão Principal",
  "status": true,
  "tipoCartao": "COMUM",
  "usuarioId": 2,
  "usuarioNome": "Usuário Teste",
  "dataCriacao": "2024-01-01T00:00:00",
  "dataAtualizacao": null
}
```

### GET /cartoes/usuario/{usuarioId}
Lista todos os cartões de um usuário específico.

**Path Parameters:**
- `usuarioId` (Long): ID do usuário

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "numeroCartao": 1001001001,
    "nome": "Cartão Principal",
    "status": true,
    "tipoCartao": "COMUM",
    "usuarioId": 2,
    "usuarioNome": "Usuário Teste",
    "dataCriacao": "2024-01-01T00:00:00"
  },
  {
    "id": 2,
    "numeroCartao": 2002002002,
    "nome": "Cartão Estudante",
    "status": true,
    "tipoCartao": "ESTUDANTE",
    "usuarioId": 2,
    "usuarioNome": "Usuário Teste",
    "dataCriacao": "2024-01-01T00:00:00"
  }
]
```

### POST /cartoes/usuario/{usuarioId}
Adiciona novo cartão a um usuário.

**Path Parameters:**
- `usuarioId` (Long): ID do usuário

**Request Body:**
```json
{
  "numeroCartao": 3003003003,
  "nome": "Cartão Trabalhador",
  "status": true,
  "tipoCartao": "TRABALHADOR"
}
```

**Tipos de Cartão:**
- `COMUM` - Cartão comum
- `ESTUDANTE` - Cartão estudantil
- `TRABALHADOR` - Cartão trabalhador

**Response (201 Created):**
```json
{
  "id": 3,
  "numeroCartao": 3003003003,
  "nome": "Cartão Trabalhador",
  "status": true,
  "tipoCartao": "TRABALHADOR",
  "usuarioId": 2,
  "usuarioNome": "Usuário Teste",
  "dataCriacao": "2024-01-15T11:15:00"
}
```

### PUT /cartoes/{id}
Atualiza dados do cartão.

**Path Parameters:**
- `id` (Long): ID do cartão

**Request Body:** (todos os campos são opcionais)
```json
{
  "numeroCartao": 3003003004,
  "nome": "Cartão Trabalhador Atualizado",
  "tipoCartao": "TRABALHADOR"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "numeroCartao": 3003003004,
  "nome": "Cartão Trabalhador Atualizado",
  "status": true,
  "tipoCartao": "TRABALHADOR",
  "usuarioId": 2,
  "usuarioNome": "Usuário Teste",
  "dataCriacao": "2024-01-15T11:15:00",
  "dataAtualizacao": "2024-01-15T11:30:00"
}
```

### PATCH /cartoes/{id}/status
Ativa ou desativa um cartão.

**Path Parameters:**
- `id` (Long): ID do cartão

**Query Parameters:**
- `status` (Boolean): true para ativar, false para desativar

**Exemplo:**
```
PATCH /cartoes/1/status?status=false
```

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroCartao": 1001001001,
  "nome": "Cartão Principal",
  "status": false,
  "tipoCartao": "COMUM",
  "usuarioId": 2,
  "usuarioNome": "Usuário Teste",
  "dataCriacao": "2024-01-01T00:00:00",
  "dataAtualizacao": "2024-01-15T11:45:00"
}
```

### DELETE /cartoes/{cartaoId}/usuario/{usuarioId}
Remove cartão de um usuário específico.

**Path Parameters:**
- `cartaoId` (Long): ID do cartão
- `usuarioId` (Long): ID do usuário

**Response:** 204 No Content

### DELETE /cartoes/{id}
Remove cartão permanentemente.

**Path Parameters:**
- `id` (Long): ID do cartão

**Response:** 204 No Content

---

## ❌ Códigos de Erro

### 400 Bad Request
Requisição inválida, dados incorretos ou validação falhou.

```json
{
  "status": 400,
  "message": "Erro de validação",
  "timestamp": "2024-01-15T12:00:00",
  "path": "/api/usuarios",
  "errors": {
    "nome": "Nome é obrigatório",
    "email": "Email inválido"
  }
}
```

### 401 Unauthorized
Token JWT inválido ou ausente.

```json
{
  "status": 401,
  "message": "Não autorizado: Token inválido",
  "timestamp": "2024-01-15T12:00:00",
  "path": "/api/usuarios"
}
```

### 403 Forbidden
Usuário não tem permissão para acessar o recurso.

```json
{
  "status": 403,
  "message": "Acesso negado",
  "timestamp": "2024-01-15T12:00:00",
  "path": "/api/usuarios"
}
```

### 404 Not Found
Recurso não encontrado.

```json
{
  "status": 404,
  "message": "Usuário não encontrado com id: '999'",
  "timestamp": "2024-01-15T12:00:00",
  "path": "/api/usuarios/999"
}
```

### 500 Internal Server Error
Erro interno do servidor.

```json
{
  "status": 500,
  "message": "Erro interno do servidor",
  "timestamp": "2024-01-15T12:00:00",
  "path": "/api/usuarios"
}
```

---

## 🧪 Exemplos com cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@urbana.com",
    "senha": "admin123"
  }'
```

### Listar Usuários
```bash
curl -X GET http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer {seu-token-aqui}"
```

### Criar Usuário
```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token-aqui}" \
  -d '{
    "nome": "Novo Usuário",
    "email": "novo@email.com",
    "senha": "senha123"
  }'
```

### Adicionar Cartão
```bash
curl -X POST http://localhost:8080/api/cartoes/usuario/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu-token-aqui}" \
  -d '{
    "numeroCartao": 4004004004,
    "nome": "Meu Cartão",
    "status": true,
    "tipoCartao": "COMUM"
  }'
```

### Ativar/Desativar Cartão
```bash
curl -X PATCH "http://localhost:8080/api/cartoes/1/status?status=false" \
  -H "Authorization: Bearer {seu-token-aqui}"
```

---

## 📚 Documentação Interativa

Para documentação interativa e testagem dos endpoints, acesse:

🔗 **Swagger UI:** http://localhost:8080/api/swagger-ui.html

O Swagger permite:
- Ver todos os endpoints disponíveis
- Testar os endpoints diretamente no navegador
- Ver exemplos de request/response
- Autenticar com token JWT
- Gerar código cliente em várias linguagens
