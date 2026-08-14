"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../services/api.js";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function loadUser() {
            try {
                const response =
                    await apiFetch(
                        "/api/auth/me"
                    );

                setUser(
                    response.data.user
                );
            } catch (error) {
                if (error.status === 401) {
                    router.replace("/login");
                    return;
                }

                setErro(
                    "Não foi possível carregar seus dados."
                );
            } finally {
                setCarregando(false);
            }
        }

        loadUser();
    }, [router]);

    async function handleLogout() {
        try {
            await apiFetch(
                "/api/auth/logout",
                {
                    method: "POST",
                }
            );
        } finally {
            router.replace("/login");
        }
    }

    if (carregando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Carregando...
                </p>
            </main>
        );
    }

    if (erro) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-red-600">
                        {erro}
                    </p>
                </div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <p className="text-sm text-slate-500">
                            Web Finances
                        </p>

                        <h1 className="text-xl font-semibold text-slate-900">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/accounts"
                            className="rounded-lg bg-[var(--blue)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            Contas
                        </Link>

                        <Link
                            href="/categories"
                            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background)]"
                        >
                            Categorias
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Bem-vindo
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {user.nome}
                    </h2>

                    <p className="mt-2 text-slate-600">
                        {user.email}
                    </p>
                </div>
            </section>
        </main>
    );
}