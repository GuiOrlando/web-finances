import * as z from "zod";

const ACCOUNT_TYPES = [
    "corrente",
    "poupanca",
    "carteira",
    "investimento",
];

const moneySchema = z
    .string()
    .trim()
    .transform((value) =>
        value.replace(",", ".")
    )
    .refine(
        (value) =>
            /^-?\d{1,13}(\.\d{1,2})?$/.test(
                value
            ),
        {
            message:
                "Valor monetário inválido.",
        }
    );

export const createAccountSchema = z
    .object({
        nome: z
            .string()
            .trim()
            .min(
                2,
                "Nome deve possuir pelo menos 2 caracteres."
            )
            .max(
                100,
                "Nome deve possuir no máximo 100 caracteres."
            ),

        tipo: z.enum(ACCOUNT_TYPES),

        saldoInicial:
            moneySchema.optional(),
    })
    .strict();

export const updateAccountSchema = z
    .object({
        nome: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        tipo: z
            .enum(ACCOUNT_TYPES)
            .optional(),

        saldoInicial:
            moneySchema.optional(),
    })
    .strict()
    .refine(
        (data) =>
            Object.keys(data).length > 0,
        {
            message:
                "Informe pelo menos um campo para atualização.",
        }
    );

export const accountIdSchema =
    z.object({
        id: z.coerce
            .number()
            .int()
            .positive(),
    });