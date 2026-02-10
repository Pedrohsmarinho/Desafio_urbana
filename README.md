# 🚌 Sistema de Gestão Urbana

Sistema completo de gestão de usuários e cartões de ônibus desenvolvido com Spring Boot e Angular.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como resposta ao Desafio Técnico Analista 2026, implementando um sistema completo de gestão de usuários e cartões de transporte público com todas as funcionalidades requisitadas e diversos diferenciais.

## ✨ Funcionalidades

### Gestão de Usuários
- ✅ Listar todos os usuários
- ✅ Criar novo usuário
- ✅ Atualizar dados do usuário
- ✅ Remover usuário (soft delete)
- ✅ Filtrar usuários por status (ativo/inativo)
- ✅ Buscar usuários por nome ou email

### Gestão de Cartões
- ✅ Listar todos os cartões
- ✅ Adicionar cartão a um usuário
- ✅ Remover cartão de um usuário
- ✅ Ativar/Desativar cartão
- ✅ Filtrar cartões por tipo (COMUM, ESTUDANTE, TRABALHADOR)
- ✅ Buscar cartões por número, nome ou usuário

### Segurança e Autenticação
- ✅ Sistema de login com JWT
- ✅ Controle de permissões (ROLE_USER e ROLE_ADMIN)
- ✅ Rotas protegidas por autenticação
- ✅ Registro de novos usuários

## 🏗️ Arquitetura

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/urbana/
│   ├── config/              # Configurações (Swagger, CORS)
│   ├── controller/          # Controllers REST
│   ├── exception/           # Tratamento de exceções
│   ├── mapper/              # Conversão Entity ↔ DTO
│   ├── model/
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # Entidades JPA
│   │   └── enums/          # Enumerações
│   ├── repository/         # Repositories JPA
│   ├── security/           # Configuração JWT e Spring Security
│   └── service/            # Lógica de negócio
└── src/main/resources/
    ├── application.properties
    └── db/migration/       # Scripts Flyway
```

### Frontend (Angular)
```
frontend/
└── src/app/
    ├── components/         # Componentes da aplicação
    │   ├── dashboard/     # Dashboard com estatísticas
    │   ├── login/         # Tela de login
    │   ├── registrar/     # Registro de usuário
    │   ├── usuarios/      # CRUD de usuários
    │   └── cartoes/       # CRUD de cartões
    ├── guards/            # Guards de autenticação
    ├── interceptors/      # Interceptors HTTP
    ├── models/            # Interfaces TypeScript
    └── services/          # Serviços HTTP
```

## 🛠️ Tecnologias Utilizadas

### Backend
- ☕ **Java 17** - Linguagem de programação
- 🍃 **Spring Boot 3.2.2** - Framework principal
- 🔐 **Spring Security** - Autenticação e autorização
- 🔑 **JWT (jjwt 0.12.3)** - Tokens de autenticação
- 🗄️ **PostgreSQL** - Banco de dados
- 📊 **JPA/Hibernate** - ORM
- 🔄 **Flyway** - Migrations de banco de dados
- 📝 **Swagger/OpenAPI** - Documentação da API
- 🔨 **Maven** - Gerenciador de dependências

### Frontend
- 🅰️ **Angular 17** - Framework frontend
- 💅 **Bootstrap 5** - Framework CSS
- 🎨 **Bootstrap Icons** - Ícones
- 📡 **RxJS** - Programação reativa
- 🔧 **TypeScript** - Linguagem tipada

### DevOps
- 🐳 **Docker & Docker Compose** - Containerização
- 🌐 **Nginx** - Servidor web para frontend

## 📦 Requisitos

- Java 17 ou superior
- Node.js 20 ou superior
- Docker e Docker Compose (opcional, mas recomendado)
- PostgreSQL 15 (se não usar Docker)
- Maven 3.9 ou superior

## 🚀 Como Executar

### Opção 1: Com Docker (Recomendado)

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd desafio-urbana
```

2. **Execute com Docker Compose**
```bash
docker-compose up --build
```

3. **Acesse a aplicação**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html

### Opção 2: Execução Local

#### Backend

1. **Configure o PostgreSQL**
```bash
# Crie o banco de dados
createdb urbana_db

# Ou use Docker apenas para o banco
docker run --name urbana-postgres \
  -e POSTGRES_DB=urbana_db \
  -e POSTGRES_USER=urbana_user \
  -e POSTGRES_PASSWORD=urbana_pass \
  -p 5432:5432 \
  -d postgres:15-alpine
```

2. **Execute o backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em: http://localhost:8080/api

#### Frontend

1. **Instale as dependências**
```bash
cd frontend
npm install
```

2. **Execute o frontend**
```bash
npm start
```

O frontend estará disponível em: http://localhost:4200

## 🔑 Credenciais de Teste

O sistema vem com usuários pré-cadastrados para testes:

### Administrador
- **Email:** admin@urbana.com
- **Senha:** admin123
- **Permissões:** Acesso total ao sistema

### Usuário Comum
- **Email:** user@urbana.com
- **Senha:** user123
- **Permissões:** Acesso limitado

## 📚 Documentação da API

Após iniciar o backend, acesse a documentação interativa Swagger:

🔗 http://localhost:8080/api/swagger-ui.html

### Principais Endpoints

#### Autenticação
- `POST /auth/login` - Realizar login
- `POST /auth/registrar` - Registrar novo usuário

#### Usuários
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/{id}` - Buscar usuário por ID
- `POST /usuarios` - Criar novo usuário (Admin)
- `PUT /usuarios/{id}` - Atualizar usuário
- `DELETE /usuarios/{id}` - Desativar usuário

#### Cartões
- `GET /cartoes` - Listar todos os cartões
- `GET /cartoes/usuario/{usuarioId}` - Listar cartões de um usuário
- `POST /cartoes/usuario/{usuarioId}` - Adicionar cartão a usuário
- `PATCH /cartoes/{id}/status` - Ativar/Desativar cartão
- `DELETE /cartoes/{cartaoId}/usuario/{usuarioId}` - Remover cartão

## 🎯 Requisitos Atendidos

### Obrigatórios ✅
- [x] Java 8+ (usando Java 17)
- [x] Spring Boot
- [x] Maven para build
- [x] JPA para persistência
- [x] Arquitetura em camadas
- [x] PostgreSQL como SGBD
- [x] Angular 4+ (usando Angular 17)
- [x] Repositório Git online

### Diferenciais ✅
- [x] Sistema de login com autenticação JWT
- [x] Controle de perfis e permissões (ROLE_USER e ROLE_ADMIN)
- [x] Migrations com Flyway
- [x] Documentação com Swagger
- [x] Uso de Native Queries no Repository
- [x] **Não utiliza Lombok** (conforme solicitado)
- [x] Padrão DTO em toda a aplicação
- [x] Design Patterns (Factory, Builder, Strategy)
- [x] Design responsivo com Bootstrap 5
- [x] Containerização com Docker

## 🎨 Interface do Usuário

O frontend foi desenvolvido com foco em:
- ✨ Design moderno e responsivo
- 🎯 UX intuitiva e amigável
- 📱 Mobile-first approach
- ♿ Acessibilidade
- 🎨 Componentes reutilizáveis
- ⚡ Performance otimizada

## 🧪 Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## 📁 Estrutura do Banco de Dados

### Tabela: usuarios
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | ID único do usuário |
| nome | VARCHAR(100) | Nome completo |
| email | VARCHAR(150) | Email (único) |
| senha | VARCHAR(255) | Senha criptografada |
| role | VARCHAR(20) | Perfil (ROLE_USER/ROLE_ADMIN) |
| ativo | BOOLEAN | Status ativo/inativo |
| data_criacao | TIMESTAMP | Data de criação |
| data_atualizacao | TIMESTAMP | Data da última atualização |

### Tabela: cartoes
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | ID único do cartão |
| numero_cartao | BIGINT | Número único do cartão |
| nome | VARCHAR(100) | Nome identificador |
| status | BOOLEAN | Ativo/Inativo |
| tipo_cartao | VARCHAR(20) | COMUM/ESTUDANTE/TRABALHADOR |
| usuario_id | BIGINT | FK para usuários |
| data_criacao | TIMESTAMP | Data de criação |
| data_atualizacao | TIMESTAMP | Data da última atualização |

## 🔒 Segurança

- Senhas criptografadas com BCrypt
- Autenticação via JWT
- Tokens com expiração de 24 horas
- Proteção CORS configurada
- Rotas protegidas por autenticação
- Controle de acesso baseado em roles

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👨‍💻 Autor

Desenvolvido para o Desafio Técnico Analista 2026 - Sistema Urbana

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique a documentação do Swagger
2. Consulte os logs da aplicação
3. Abra uma issue no repositório

## 🔄 Próximos Passos (Melhorias Futuras)

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar paginação nas listagens
- [ ] Implementar cache com Redis
- [ ] Adicionar relatórios e dashboards avançados
- [ ] Implementar notificações em tempo real
- [ ] Adicionar exportação de dados (PDF, Excel)
- [ ] Implementar auditoria completa de ações
- [ ] Adicionar internacionalização (i18n)

---

⭐ **Obrigado por avaliar este projeto!** ⭐
