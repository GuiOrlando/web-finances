ALTER TABLE categorias
    ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE AFTER tipo,
    ADD INDEX idx_categorias_usuario_ativo_tipo (
        usuario_id,
        ativo,
        tipo
    );