"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../services/api";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");

        const emailNormalizado =
            email.trim().toLowerCase();

        if (!emailNormalizado) {
            setErro("Informe seu e-mail.");
            return;
        }

        if (!senha) {
            setErro("Informe sua senha.");
            return;
        }

        try {
            setCarregando(true);

            await apiFetch(
                "/api/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: emailNormalizado,
                        senha,
                    }),
                }
            );

            router.replace("/dashboard");
        } catch (error) {
            if (error.code === "INVALID_CREDENTIALS") {
                setErro(
                    "E-mail ou senha inválidos."
                );

                return;
            }

            if (error.code === "TOO_MANY_REQUESTS") {
                setErro(
                    "Muitas tentativas. Aguarde alguns minutos e tente novamente."
                );

                return;
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-8">
                <p className="text-sm font-medium text-slate-500">
                    Web Finances
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Entrar
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Acesse sua conta para gerenciar suas finanças.
                </p>
            </div>

            <form 
                onSubmit={handleSubmit} 
                className="space-y-5"
            >
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        E-mail
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        disabled={carregando}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                        placeholder="voce@exemplo.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="senha"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Senha
                    </label>

                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={senha}
                        onChange={(event) =>
                            setSenha(
                                event.target.value
                            )
                        }
                        disabled={carregando}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                        placeholder="Sua senha"
                    />
                </div>

                {erro && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {erro}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={carregando}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {carregando
                        ? "Entrando"
                        : "Entrar"}
                </button>
            </form>
        </section>
    );
}