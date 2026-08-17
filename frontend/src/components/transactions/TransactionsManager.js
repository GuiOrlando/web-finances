"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TransactionCard from "./TransactionCard.js";
import TransactionForm from "./TransactionForm.js";
import { deleteTransaction, getTransactions } from "../../services/transactions.js";
import { getAccounts } from "../../services/accounts.js";
import { getCategories } from "../../services/categories.js";

export default function TransactionsManager() {
    const router = useRouter();

    const [transactions, setTransactions] =
        useState([]);

    const [accounts, setAccounts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [
        editingTransaction,
        setEditingTransaction,
    ] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    function handleUnauthorized() {
        router.replace("/login");
    }

    async function refreshTransactions() {
        try {
            const response =
                await getTransactions();

            setTransactions(
                response.data.transactions
            );

            setError("");
        } catch (error) {
            if (error.status === 401) {
                handleUnauthorized();
                return;
            }

            setError(
                "Não foi possível carregar as transações."
            );
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function initialLoad() {
            try {
                const [
                    transactionsResponse,
                    accountsResponse,
                    categoriesResponse,
                ] = await Promise.all([
                    getTransactions(),
                    getAccounts(),
                    getCategories(),
                ]);

                if (cancelled) {
                    return;
                }

                setTransactions(
                    transactionsResponse
                        .data.transactions
                );

                setAccounts(
                    accountsResponse
                        .data.accounts
                );

                setCategories(
                    categoriesResponse
                        .data.categories
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
                    "Não foi possível carregar os dados financeiros."
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

    async function handleDelete(
        transaction
    ) {
        const confirmed =
            window.confirm(
                `Deseja excluir a transação "${transaction.descricao}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setProcessing(true);

            await deleteTransaction(
                transaction.id
            );

            if (
                editingTransaction?.id ===
                transaction.id
            ) {
                setEditingTransaction(null);
            }

            await refreshTransactions();
        } catch (error) {
            if (error.status === 401) {
                handleUnauthorized();
                return;
            }

            setError(
                "Não foi possível excluir a transação."
            );
        } finally {
            setProcessing(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-6">
                <p className="text-[var(--muted)]">
                    Carregando transações...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <header className="border-b border-[var(--border)] bg-[var(--card)]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-sm font-medium text-[var(--blue)]">
                            Web Finances
                        </p>

                        <h1 className="text-2xl font-bold text-[var(--foreground)]">
                            Transações
                        </h1>
                    </div>

                    <Link
                        href="/dashboard"
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[390px_1fr]">
                <TransactionForm
                    key={
                        editingTransaction
                            ? `edit-${editingTransaction.id}`
                            : "new"
                    }
                    transaction={
                        editingTransaction
                    }
                    accounts={accounts}
                    categories={categories}
                    onSaved={async () => {
                        setEditingTransaction(
                            null
                        );

                        await refreshTransactions();
                    }}
                    onCancel={() =>
                        setEditingTransaction(
                            null
                        )
                    }
                    onUnauthorized={
                        handleUnauthorized
                    }
                />

                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">
                            Histórico
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            Receitas e despesas registradas.
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

                    {transactions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center">
                            <p className="font-medium text-[var(--foreground)]">
                                Nenhuma transação registrada
                            </p>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                Registre sua primeira receita ou despesa.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {transactions.map(
                                (transaction) => (
                                    <TransactionCard
                                        key={
                                            transaction.id
                                        }
                                        transaction={
                                            transaction
                                        }
                                        onEdit={
                                            setEditingTransaction
                                        }
                                        onDelete={
                                            handleDelete
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