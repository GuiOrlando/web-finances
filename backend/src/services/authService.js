import argon2 from "argon2";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";
import { AppError } from "../errors/AppError.js";

export async function registerUser({
    nome,
    email,
    senha,
}) {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new AppError(
            "Não foi possível cadastrar este e-mail.",
            409,
            "EMAIL_ALREADY_REGISTERED"
        );
    }

    const senhaHash = await argon2.hash(senha, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
    });

    try {
        const user = await createUser({
            nome,
            email,
            senhaHash,
        });

        return user;
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                "Não foi possível cadastrar este e-mail.",
                409,
                "EMAIL_ALREADY_REGISTERED"
            );
        }

        throw error;
    }
}