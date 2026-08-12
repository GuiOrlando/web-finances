import { registerUser } from "../services/authService.js";

export async function register(req, res) {
    const user = await registerUser(
        req.validatedBody
    );

    return res.status(201).json({
        data: {
            user,
        },
    });
}