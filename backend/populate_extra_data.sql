-- Script para popular dados extras no banco
-- Execute após o backend ter iniciado pela primeira vez

-- Adicionar mais usuários
INSERT INTO usuarios (nome, email, senha, role, ativo, data_criacao) 
VALUES 
    ('João Silva', 'joao@urbana.com', '$2a$10$N.wmtV5VOxR8mV3khGf9YOQFOXjXlKuOQqp.VlrL9gR8mj9gXYMTS', 'ROLE_USER', TRUE, CURRENT_TIMESTAMP),
    ('Maria Santos', 'maria@urbana.com', '$2a$10$N.wmtV5VOxR8mV3khGf9YOQFOXjXlKuOQqp.VlrL9gR8mj9gXYMTS', 'ROLE_USER', TRUE, CURRENT_TIMESTAMP),
    ('Pedro Oliveira', 'pedro@urbana.com', '$2a$10$N.wmtV5VOxR8mV3khGf9YOQFOXjXlKuOQqp.VlrL9gR8mj9gXYMTS', 'ROLE_USER', TRUE, CURRENT_TIMESTAMP);

-- Adicionar mais cartões (pegue os IDs dos usuários criados)
INSERT INTO cartoes (numero_cartao, nome, status, tipo_cartao, usuario_id, data_criacao) 
VALUES 
    (3003003003, 'Cartão Trabalho', TRUE, 'TRABALHADOR', 3, CURRENT_TIMESTAMP),
    (4004004004, 'Cartão Escolar', TRUE, 'ESTUDANTE', 4, CURRENT_TIMESTAMP),
    (5005005005, 'Cartão Extra', FALSE, 'COMUM', 5, CURRENT_TIMESTAMP);

-- Verificar dados inseridos
SELECT * FROM usuarios;
SELECT * FROM cartoes;
