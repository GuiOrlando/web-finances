"use client";

const TYPE_LABELS = {
    corrente: "Conta corrente",
    poupanca: "Poupança",
    carteira: "Carteira",
    investimento: "Investimento",
};

const currencyFormatter =
    new Intl.NumberFormat(
        "pt-BR",
        {
        style: "currency",
        currency: "BRL",
        }
    );

export default function AccountCard({
    account,
    onEdit,
    onDeactivate,
    disabled,
}) {
    return (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--blue)]">
                        {TYPE_LABELS[
                            account.tipo
                        ] ?? account.tipo}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                        {account.nome}
                    </h3>
                </div>

                <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]">
                    #{account.id}
                </span>
            </div>

            <div className="mt-6">
                <p className="text-sm text-[var(--muted)]">
                    Saldo inicial
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                    {currencyFormatter.format(
                        Number(
                            account.saldoInicial
                        )
                    )}
                </p>
            </div>

            <div className="mt-6 flex gap-3 border-t border-[var(--border)] pt-4">
                <button
                    type="button"
                    onClick={() =>
                        onEdit(account)
                    }
                    disabled={disabled}
                    className="text-sm font-medium text-[var(--blue)] disabled:opacity-50"
                >
                    Editar
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onDeactivate(account)
                    }
                    disabled={disabled}
                    className="text-sm font-medium text-[var(--red)] disabled:opacity-50"
                >
                    Desativar
                </button>
            </div>
        </article>
    );
}