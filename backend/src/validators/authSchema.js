import * as z from "zod";

export const registerSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(2, "Nome deve possuir pelo menos 2 caracteres.")
        .max(120, "Nome deve possuir no máximo 120 caracteres."),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(z.email("E-mail inválido.")),

    senha: z
        .string()
        .min(12, "Senha deve possuir pelo menos 12 caracteres.")
        .max(128, "Senha deve possuir no máximo 128 caracteres."),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(
            z.email("E-mail inválido.")
        ),

    senha: z
        .string()
        .min(1, "Senha é obrigatória.")
        .max(
            128,
            "Senha deve possuir no máximo 128 caracteres."
        ),
});