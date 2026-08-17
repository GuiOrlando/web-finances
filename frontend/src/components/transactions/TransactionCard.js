"use client";

const currencyFormatter =
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

function formatDate(value) {
    const [year, month, day] =
        value.split("-");

    return `${day}/${month}/${year}`;
}

export default function TransactionCard({
    transaction,
    onEdit,
    onDelete,
    disabled,
}) {
    const isIncome =
        transaction.tipo === "receita";

    return (
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span
                        className={
                            isIncome
                                ? "text-sm font-medium text-[var(--green)]"
                                : "text-sm font-medium text-[var(--red)]"
                        }
                    >
                        {isIncome
                            ? "Receita"
                            : "Despesa"}
                    </span>

                    <h3 className="mt-1 font-semibold text-[var(--foreground)]">
                        {transaction.descricao}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                        {transaction.categoriaNome}
                    </p>
                </div>

                <p
                    className={`text-lg font-bold ${
                        isIncome
                            ? "text-[var(--green)]"
                            : "text-[var(--red)]"
                    }`}
                >
                    {isIncome ? "+" : "-"}{" "}
                    {currencyFormatter.format(
                        Number(transaction.valor)
                    )}
                </p>
            </div>

            <div className="mt-5 grid gap-2 border-t border-[var(--border)] pt-4 text-sm">
                <div className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">
                        Conta
                    </span>

                    <span className="text-right text-[var(--foreground)]">
                        {transaction.contaNome}
                    </span>
                </div>

                <div className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">
                        Data
                    </span>

                    <span>
                        {formatDate(
                            transaction.dataTransacao
                        )}
                    </span>
                </div>
            </div>

            {transaction.observacao && (
                <p className="mt-4 text-sm text-[var(--muted)]">
                    {transaction.observacao}
                </p>
            )}

            <div className="mt-5 flex gap-4 border-t border-[var(--border)] pt-4">
                <button
                    type="button"
                    onClick={() =>
                        onEdit(transaction)
                    }
                    disabled={disabled}
                    className="text-sm font-medium text-[var(--blue)] disabled:opacity-50"
                >
                    Editar
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onDelete(transaction)
                    }
                    disabled={disabled}
                    className="text-sm font-medium text-[var(--red)] disabled:opacity-50"
                >
                    Excluir
                </button>
            </div>
        </article>
    );
}