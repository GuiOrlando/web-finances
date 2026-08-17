import { pool } from "../config/database.js";

export async function findDashboardTotalsByUserId(usuarioId) {
    const [balanceRows] = await pool.execute(
        `
        SELECT
            CAST(
                COALESCE(
                    SUM(
                        c.saldo_inicial
                        +
                        COALESCE(
                            movimentos.totalMovimentado,
                            0
                        )
                    ),
                    0
                )
                AS DECIMAL(15, 2)
            ) AS saldoTotal

        FROM contas c

        LEFT JOIN (
            SELECT
                conta_id,

                SUM(
                    CASE
                        WHEN tipo = 'receita'
                            THEN valor

                        WHEN tipo = 'despesa'
                            THEN -valor

                        ELSE 0
                    END
                ) AS totalMovimentado

            FROM transacoes

            WHERE usuario_id = ?
                AND excluido_em IS NULL
                AND data_transacao <= CURRENT_DATE
                AND tipo IN (
                    'receita',
                    'despesa'
                )

            GROUP BY conta_id
        ) movimentos
            ON movimentos.conta_id = c.id

        WHERE c.usuario_id = ?
            AND c.ativo = 1
        `,
        [
            usuarioId,
            usuarioId,
        ]
    );

    const [monthRows] = await pool.execute(
        `
        SELECT
            CAST(
                COALESCE(
                    SUM(
                        CASE
                            WHEN tipo = 'receita'
                                THEN valor
                            ELSE 0
                        END
                    ),
                    0
                )
                AS DECIMAL(15, 2)
            ) AS receitasMes,

            CAST(
                COALESCE(
                    SUM(
                        CASE
                            WHEN tipo = 'despesa'
                                THEN valor
                            ELSE 0
                        END
                    ),
                    0
                )
                AS DECIMAL(15, 2)
            ) AS despesasMes,

            CAST(
                (
                    COALESCE(
                        SUM(
                            CASE
                                WHEN tipo = 'receita'
                                    THEN valor
                                ELSE 0
                            END
                        ),
                        0
                    )
                    -
                    COALESCE(
                        SUM(
                            CASE
                                WHEN tipo = 'despesa'
                                    THEN valor
                                ELSE 0
                            END
                        ),
                        0
                    )
                )
                AS DECIMAL(15, 2)
            ) AS resultadoMes

        FROM transacoes

        WHERE usuario_id = ?
            AND excluido_em IS NULL
            AND data_transacao >=
                DATE_FORMAT(
                    CURRENT_DATE,
                    '%Y-%m-01'
                )
            AND data_transacao <=
                CURRENT_DATE
            AND tipo IN (
                'receita',
                'despesa'
            )
        `,
        [usuarioId]
    );

    return {
        saldoTotal:
            balanceRows[0].saldoTotal,

        receitasMes:
            monthRows[0].receitasMes,

        despesasMes:
            monthRows[0].despesasMes,

        resultadoMes:
            monthRows[0].resultadoMes,
    };
}

export async function findRecentTransactionsByUserId(usuarioId) {
    const [rows] = await pool.execute(
        `
        SELECT
            t.id,
            t.tipo,
            t.descricao,
            t.valor,

            DATE_FORMAT(
                t.data_transacao,
                '%Y-%m-%d'
            ) AS dataTransacao,

            c.id AS contaId,
            c.nome AS contaNome,

            cat.id AS categoriaId,
            cat.nome AS categoriaNome

        FROM transacoes t

        INNER JOIN contas c
            ON c.id = t.conta_id

        LEFT JOIN categorias cat
            ON cat.id = t.categoria_id

        WHERE t.usuario_id = ?
            AND t.excluido_em IS NULL
            AND t.data_transacao <= CURRENT_DATE
            AND t.tipo IN (
                'receita',
                'despesa'
            )

        ORDER BY
            t.data_transacao DESC,
            t.id DESC

        LIMIT 5
        `,
        [usuarioId]
    );

    return rows;
}