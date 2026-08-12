import argon2 from "argon2";

import { createUser, findUserByEmail } from "../repositories/userRepository.js";
import { AppError } from "../errors/AppError.js";
import { createUserSession } from "./sessionService.js";

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
};

const DUMMY_PASSWORD_HASH = await argon2.hash(
    "dummy-password-never-used",
    ARGON2_OPTIONS
);

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

    const senhaHash = await argon2.hash(
        senha,
        ARGON2_OPTIONS
    );

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

export async function loginUser({
    email,
    senha,
}) {
    const user = await findUserByEmail(email);

    const hashToVerify =
        user?.senha_hash ?? DUMMY_PASSWORD_HASH;

    let passwordIsValid = false;

    try {
        passwordIsValid = await argon2.verify(
            hashToVerify,
            senha
        );
    } catch {
        passwordIsValid = false;
    }

    if (
        !user ||
        !passwordIsValid ||
        !user.ativo
    ) {
        throw new AppError(
            "E-mail ou senha inválidos.",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    const session = await createUserSession(
        user.id
    );

    return {
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
        },

        session,
    };
}