"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../services/api.js";
import { getDashboardSummary } from "../../services/dashboard.js";

const currencyFormatter =
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

const ACCOUNT_TYPE_LABELS = {
    corrente: "Conta corrente",
    poupanca: "Poupança",
    carteira: "Carteira",
    investimento: "Investimento",
};

function formatCurrency(value) {
    return currencyFormatter.format(
        Number(value)
    );
}

function formatDate(value) {
    const [year, month, day] =
        value.split("-");

    return `${day}/${month}/${year}`;
}

export default function DashboardManager() {
    const router = useRouter();

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let cancelled = false;

        async function initialLoad() {
            try {
                const response =
                    await getDashboardSummary();

                if (cancelled) {
                    return;
                }

                setDashboard(
                    response.data
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
                    "Não foi possível carregar o dashboard."
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

    async function handleLogout() {
        try {
            setLoggingOut(true);

            await apiFetch(
                "/api/auth/logout",
                {
                    method: "POST",
                }
            );

            router.replace("/login");
        } catch {
            setError(
                "Não foi possível encerrar a sessão."
            );
        } finally {
            setLoggingOut(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-6">
                <p className="text-[var(--muted)]">
                    Carregando dashboard...
                </p>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-6">
                <div
                    role="alert"
                    className="rounded-xl border border-[var(--red)] bg-[var(--card)] p-4 text-[var(--red)]"
                >
                    {error ||
                        "Dashboard indisponível."}
                </div>
            </main>
        );
    }

    const {
        summary,
        accounts,
        recentTransactions,
    } = dashboard;

    const result =
        Number(summary.resultadoMes);

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <header className="border-b border-[var(--border)] bg-[var(--card)]">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[var(--blue)]">
                            Web Finances
                        </p>

                        <h1 className="text-2xl font-bold text-[var(--foreground)]">
                            Dashboard
                        </h1>
                    </div>

                    <nav
                        aria-label="Navegação principal"
                        className="flex flex-wrap items-center gap-2"
                    >
                        <Link
                            href="/accounts"
                            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background)]"
                        >
                            Contas
                        </Link>

                        <Link
                            href="/categories"
                            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background)]"
                        >
                            Categorias
                        </Link>

                        <Link
                            href="/transactions"
                            className="rounded-lg bg-[var(--blue)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            Transações
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:opacity-60"
                        >
                            {loggingOut
                                ? "Saindo..."
                                : "Sair"}
                        </button>
                    </nav>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-8">
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-lg border border-[var(--red)] bg-[var(--card)] p-4 text-sm text-[var(--red)]"
                    >
                        {error}
                    </div>
                )}

                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">
                            Visão geral
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                            Resumo financeiro até hoje.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            title="Saldo total"
                            value={formatCurrency(
                                summary.saldoTotal
                            )}
                            description="Saldo atual das contas"
                            valueClass="text-[var(--foreground)]"
                        />

                        <SummaryCard
                            title="Receitas do mês"
                            value={formatCurrency(
                                summary.receitasMes
                            )}
                            description="Entradas realizadas"
                            valueClass="text-[var(--green)]"
                        />

                        <SummaryCard
                            title="Despesas do mês"
                            value={formatCurrency(
                                summary.despesasMes
                            )}
                            description="Saídas realizadas"
                            valueClass="text-[var(--red)]"
                        />

                        <SummaryCard
                            title="Resultado do mês"
                            value={formatCurrency(
                                summary.resultadoMes
                            )}
                            description="Receitas menos despesas"
                            valueClass={
                                result < 0
                                    ? "text-[var(--red)]"
                                    : "text-[var(--green)]"
                            }
                        />
                    </div>
                </section>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                    <section>
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                                    Contas
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Saldos atuais.
                                </p>
                            </div>

                            <Link
                                href="/accounts"
                                className="text-sm font-medium text-[var(--blue)]"
                            >
                                Ver contas
                            </Link>
                        </div>

                        {accounts.length === 0 ? (
                            <EmptyState>
                                Nenhuma conta ativa.
                            </EmptyState>
                        ) : (
                            <div className="space-y-3">
                                {accounts.map(
                                    (account) => (
                                        <div
                                            key={
                                                account.id
                                            }
                                            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm text-[var(--muted)]">
                                                        {
                                                            ACCOUNT_TYPE_LABELS[
                                                                account
                                                                    .tipo
                                                            ] ??
                                                            account.tipo
                                                        }
                                                    </p>

                                                    <h3 className="mt-1 font-semibold text-[var(--foreground)]">
                                                        {
                                                            account.nome
                                                        }
                                                    </h3>
                                                </div>

                                                <p className="text-lg font-bold text-[var(--foreground)]">
                                                    {formatCurrency(
                                                        account.saldoAtual
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                                    Transações recentes
                                </h2>

                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    Últimas movimentações efetivadas.
                                </p>
                            </div>

                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-[var(--blue)]"
                            >
                                Ver histórico
                            </Link>
                        </div>

                        {recentTransactions.length ===
                        0 ? (
                            <EmptyState>
                                Nenhuma transação realizada.
                            </EmptyState>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                                {recentTransactions.map(
                                    (
                                        transaction,
                                        index
                                    ) => (
                                        <RecentTransaction
                                            key={
                                                transaction.id
                                            }
                                            transaction={
                                                transaction
                                            }
                                            showBorder={
                                                index !==
                                                recentTransactions.length -
                                                    1
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

function SummaryCard({
    title,
    value,
    description,
    valueClass,
}) {
    return (
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <p className="text-sm font-medium text-[var(--muted)]">
                {title}
            </p>

            <p
                className={`mt-2 text-2xl font-bold ${valueClass}`}
            >
                {value}
            </p>

            <p className="mt-2 text-xs text-[var(--muted)]">
                {description}
            </p>
        </article>
    );
}

function RecentTransaction({
    transaction,
    showBorder,
}) {
    const isIncome =
        transaction.tipo === "receita";

    return (
        <article
            className={`flex items-center justify-between gap-5 p-5 ${
                showBorder
                    ? "border-b border-[var(--border)]"
                    : ""
            }`}
        >
            <div className="min-w-0">
                <p className="truncate font-medium text-[var(--foreground)]">
                    {transaction.descricao}
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    {transaction.categoriaNome ??
                        "Sem categoria"}{" "}
                    · {transaction.contaNome}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                    {formatDate(
                        transaction.dataTransacao
                    )}
                </p>
            </div>

            <p
                className={`shrink-0 font-semibold ${
                    isIncome
                        ? "text-[var(--green)]"
                        : "text-[var(--red)]"
                }`}
            >
                {isIncome ? "+" : "-"}{" "}
                {formatCurrency(
                    transaction.valor
                )}
            </p>
        </article>
    );
}

function EmptyState({ children }) {
    return (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted)]">
            {children}
        </div>
    );
}