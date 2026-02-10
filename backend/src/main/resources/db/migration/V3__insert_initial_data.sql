-- Inserir usuário admin padrão
-- Senha: admin123 (criptografada com BCrypt)
-- NOTA: Este hash será corrigido pela migration V4
INSERT INTO usuarios (nome, email, senha, role, ativo, data_criacao) 
VALUES (
    'Administrador',
    'admin@urbana.com',
    '$2a$10$temporaryHash',
    'ROLE_ADMIN',
    TRUE,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Inserir usuário comum para testes
-- Senha: user123 (criptografada com BCrypt)
-- NOTA: Este hash será corrigido pela migration V4
INSERT INTO usuarios (nome, email, senha, role, ativo, data_criacao) 
VALUES (
    'Usuário Teste',
    'user@urbana.com',
    '$2a$10$temporaryHash',
    'ROLE_USER',
    TRUE,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Inserir cartões de exemplo
INSERT INTO cartoes (numero_cartao, nome, status, tipo_cartao, usuario_id, data_criacao) 
VALUES (
    1001001001,
    'Cartão Principal',
    TRUE,
    'COMUM',
    2,
    CURRENT_TIMESTAMP
)
ON CONFLICT (numero_cartao) DO NOTHING;

INSERT INTO cartoes (numero_cartao, nome, status, tipo_cartao, usuario_id, data_criacao) 
VALUES (
    2002002002,
    'Cartão Estudante',
    TRUE,
    'ESTUDANTE',
    2,
    CURRENT_TIMESTAMP
)
ON CONFLICT (numero_cartao) DO NOTHING;
