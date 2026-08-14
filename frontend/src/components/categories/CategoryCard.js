"use client";

export default function CategoryCard({category, onEdit, onDeactivate, disabled}) {
    const isIncome = category.tipo === "receita";

    const typeLabel =
        isIncome
            ? "Receita"
            : "Despesa";

    return (
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            isIncome
                                ? "bg-green-50 text-[var(--green)]"
                                : "bg-red-50 text-[var(--red)]"
                        }`}
                    >
                        {typeLabel}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                        {category.nome}
                    </h3>
                </div>

                <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]">
                    #{category.id}
                </span>
            </div>

            <div className="mt-5 flex gap-4 border-t border-[var(--border)] pt-4">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                        onEdit(category)
                    }
                    className="text-sm font-medium text-[var(--blue)] transition hover:opacity-75 disabled:opacity-50"
                >
                    Editar
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                        onDeactivate(category)
                    }
                    className="text-sm font-medium text-[var(--red)] transition hover:opacity-75 disabled:opacity-50"
                >
                    Desativar
                </button>
            </div>
        </article>
    );
}