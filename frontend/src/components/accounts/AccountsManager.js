"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import AccountCard from "./AccountCard.js";
import AccountForm from "./AccountForm.js";

import { deactivateAccount, getAccounts } from "../../services/accounts.js";

export default function AccountsManager() {
    const router = useRouter();
    const [accounts, setAccounts] = useState([]);

    const [
        editingAccount,
        setEditingAccount,
    ] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    function handleUnauthorized() {
        router.replace("/login");
    }

    async function refreshAccounts() {
        try {
            const response =
                await getAccounts();

            setAccounts(
                response.data.accounts
            );

            setError("");
        } catch (error) {
            if (error.status === 401) {
                handleUnauthorized();
                return;
            }

            setError(
                "Não foi possível carregar suas contas."
            );
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function initialLoad() {
            try {
                const response =
                    await getAccounts();

                if (cancelled) {
                    return;
                }

                setAccounts(
                    response.data.accounts
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                if (error.status === 401) {
                    router.replace("/login");
                    return;
                }

                setError(
                    "Não foi possível carregar suas contas."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        initialLoad();

        return () => {
            cancelled = true;
        };
    }, [router]);

    async function handleDeactivate(
        account
    ) {
        const confirmed =
            window.confirm(
                `Deseja desativar a conta "${account.nome}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setProcessing(true);

            await deactivateAccount(
                account.id
            );

            if (
                editingAccount?.id ===
                account.id
            ) {
                setEditingAccount(null);
            }

            await refreshAccounts();
        } catch (error) {
            if (error.status === 401) {
                handleUnauthorized();
                return;
            }

            setError(
                "Não foi possível desativar a conta."
            );
        } finally {
            setProcessing(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-6">
                <p className="text-[var(--muted)]">
                    Carregando contas...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <header className="border-b border-[var(--border)] bg-[var(--card)]">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-sm font-medium text-[var(--blue)]">
                            Web Finances
                        </p>

                        <h1 className="text-2xl font-bold text-[var(--foreground)]">
                            Contas
                        </h1>
                    </div>

                    <Link
                        href="/dashboard"
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[360px_1fr]">
                <AccountForm
                    key={
                        editingAccount
                            ? `edit-${editingAccount.id}`
                            : "new"
                    }
                    account={editingAccount}
                    onSaved={async () => {
                        setEditingAccount(null);
                        await refreshAccounts();
                    }}
                    onCancel={() =>
                        setEditingAccount(null)
                    }
                    onUnauthorized={
                        handleUnauthorized
                    }
                />

                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">
                            Suas contas
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            Contas ativas cadastradas no sistema.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-lg border border-[var(--red)] p-4 text-sm text-[var(--red)]"
                        >
                            {error}
                        </div>
                    )}

                    {accounts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center">
                            <p className="font-medium text-[var(--foreground)]">
                                Nenhuma conta cadastrada
                            </p>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                Cadastre sua primeira conta usando o formulário.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {accounts.map(
                                (account) => (
                                    <AccountCard
                                        key={account.id}
                                        account={account}
                                        onEdit={
                                            setEditingAccount
                                        }
                                        onDeactivate={
                                            handleDeactivate
                                        }
                                        disabled={
                                            processing
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}