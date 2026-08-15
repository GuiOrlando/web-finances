import * as z from "zod";

const transactionTypeSchema = z.enum([
    "receita",
    "despesa",
]);

const moneySchema = z
    .string()
    .trim()
    .refine(
        (value) =>
            /^\d{1,13}(\.\d{1,2})?$/.test(value),
        {
            message:
                "Valor monetário inválido.",
        }
    )
    .refine(
        (value) =>
            Number(value) > 0,
        {
            message:
                "O valor deve ser maior que zero.",
        }
    );

const dateSchema = z
    .string()
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Data inválida."
    );

export const createTransactionSchema =
    z.object({
        contaId: z.coerce
            .number()
            .int()
            .positive(),

        categoriaId: z.coerce
            .number()
            .int()
            .positive(),

        tipo: transactionTypeSchema,

        descricao: z
            .string()
            .trim()
            .min(
                2,
                "Descrição deve possuir pelo menos 2 caracteres."
            )
            .max(
                255,
                "Descrição deve possuir no máximo 255 caracteres."
            ),

        valor: moneySchema,

        dataTransacao: dateSchema,

        observacao: z
            .string()
            .trim()
            .max(
                2000,
                "Observação muito longa."
            )
            .optional()
            .nullable(),
    })
    .strict();

export const updateTransactionSchema =
    createTransactionSchema
        .partial()
        .refine(
            (data) =>
                Object.keys(data).length > 0,
            {
                message:
                    "Informe pelo menos um campo para atualização.",
            }
        );

export const transactionIdSchema =
    z.object({
        id: z.coerce
            .number()
            .int()
            .positive(),
    });