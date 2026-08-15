ALTER TABLE transacoes
    ADD COLUMN atualizado_em TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
        AFTER criado_em,

    ADD COLUMN excluido_em DATETIME NULL
        AFTER atualizado_em,

    ADD INDEX idx_transacoes_usuario_excluido_data (
        usuario_id,
        excluido_em,
        data_transacao
    );