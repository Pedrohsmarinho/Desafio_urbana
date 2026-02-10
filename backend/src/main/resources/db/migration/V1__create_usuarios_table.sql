-- Tabela de Usuários
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP,
    CONSTRAINT usuarios_email_unique UNIQUE (email)
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);

-- Comentários
COMMENT ON TABLE usuarios IS 'Tabela para armazenar informações dos usuários do sistema';
COMMENT ON COLUMN usuarios.id IS 'Identificador único do usuário';
COMMENT ON COLUMN usuarios.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN usuarios.email IS 'Email do usuário (usado para login)';
COMMENT ON COLUMN usuarios.senha IS 'Senha criptografada do usuário';
COMMENT ON COLUMN usuarios.role IS 'Papel do usuário no sistema (ROLE_USER ou ROLE_ADMIN)';
COMMENT ON COLUMN usuarios.ativo IS 'Indica se o usuário está ativo no sistema';
