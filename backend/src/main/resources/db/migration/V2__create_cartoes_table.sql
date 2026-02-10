-- Tabela de Cartões
CREATE TABLE cartoes (
    id BIGSERIAL PRIMARY KEY,
    numero_cartao BIGINT NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_cartao VARCHAR(20) NOT NULL,
    usuario_id BIGINT NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP,
    CONSTRAINT fk_cartoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT cartoes_numero_unique UNIQUE (numero_cartao),
    CONSTRAINT cartoes_tipo_check CHECK (tipo_cartao IN ('COMUM', 'ESTUDANTE', 'TRABALHADOR'))
);

-- Índices
CREATE INDEX idx_cartoes_usuario_id ON cartoes(usuario_id);
CREATE INDEX idx_cartoes_numero ON cartoes(numero_cartao);
CREATE INDEX idx_cartoes_status ON cartoes(status);
CREATE INDEX idx_cartoes_tipo ON cartoes(tipo_cartao);

-- Comentários
COMMENT ON TABLE cartoes IS 'Tabela para armazenar informações dos cartões de ônibus';
COMMENT ON COLUMN cartoes.id IS 'Identificador único do cartão';
COMMENT ON COLUMN cartoes.numero_cartao IS 'Número único do cartão de ônibus';
COMMENT ON COLUMN cartoes.nome IS 'Nome identificador do cartão';
COMMENT ON COLUMN cartoes.status IS 'Indica se o cartão está ativo (true) ou inativo (false)';
COMMENT ON COLUMN cartoes.tipo_cartao IS 'Tipo do cartão: COMUM, ESTUDANTE ou TRABALHADOR';
COMMENT ON COLUMN cartoes.usuario_id IS 'Referência ao usuário proprietário do cartão';
