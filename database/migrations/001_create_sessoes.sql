CREATE TABLE IF NOT EXISTS sessoes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    usuario_id BIGINT UNSIGNED NOT NULL,

    token_hash CHAR(64) NOT NULL UNIQUE,

    expira_em DATETIME NOT NULL,

    criado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    ultimo_acesso_em TIMESTAMP NULL,

    revogado_em TIMESTAMP NULL,

    CONSTRAINT fk_sessoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    INDEX idx_sessoes_usuario (usuario_id),
    INDEX idx_sessoes_expira_em (expira_em)
);