import * as z from "zod";

export const createCategorySchema = z
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

        tipo: z.enum([
            "receita",
            "despesa",
        ]),
    })
    .strict();

export const updateCategorySchema = z
    .object({
        nome: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        tipo: z
            .enum([
                "receita",
                "despesa",
            ])
            .optional(),
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

export const categoryIdSchema = z.object({
    id: z.coerce
        .number()
        .int()
        .positive(),
});