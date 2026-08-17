"use client";
import { useState } from "react";
import { createTransaction, updateTransaction } from "../../services/transactions.js";

const INITIAL_FORM = {
    tipo: "despesa",
    contaId: "",
    categoriaId: "",
    descricao: "",
    valor: "",
    dataTransacao: "",
    observacao: "",
};

function getInitialForm(transaction) {
    if (!transaction) {
        return {
            ...INITIAL_FORM,
        };
    }

    return {
        tipo: transaction.tipo,
        contaId: String(transaction.contaId),
        categoriaId: String(transaction.categoriaId),
        descricao: transaction.descricao,
        valor: transaction.valor,
        dataTransacao: transaction.dataTransacao,
        observacao: transaction.observacao ?? "",
    };
}

export default function TransactionForm({
    transaction,
    accounts,
    categories,
    onSaved,
    onCancel,
    onUnauthorized,
}) {
    const [form, setForm] = useState(
        () => getInitialForm(transaction)
    );

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const editing = Boolean(transaction);

    const filteredCategories =
        categories.filter(
            (category) =>
                category.tipo === form.tipo
        );

    function handleChange(event) {
        const { name, value } = event.target;

        if (name === "tipo") {
            setForm((current) => ({
                ...current,
                tipo: value,
                categoriaId: "",
            }));

            return;
        }

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!form.contaId) {
            setError("Selecione uma conta.");
            return;
        }

        if (!form.categoriaId) {
            setError("Selecione uma categoria.");
            return;
        }

        if (!form.descricao.trim()) {
            setError("Informe uma descrição.");
            return;
        }

        if (!form.valor) {
            setError("Informe o valor.");
            return;
        }

        if (!form.dataTransacao) {
            setError("Informe a data.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                contaId: Number(form.contaId),
                categoriaId: Number(
                    form.categoriaId
                ),
                tipo: form.tipo,
                descricao:
                    form.descricao.trim(),
                valor: form.valor,
                dataTransacao:
                    form.dataTransacao,
                observacao:
                    form.observacao.trim()
                        ? form.observacao.trim()
                        : null,
            };

            if (editing) {
                await updateTransaction(
                    transaction.id,
                    payload
                );
            } else {
                await createTransaction(
                    payload
                );
            }

            await onSaved();
        } catch (error) {
            if (error.status === 401) {
                onUnauthorized();
                return;
            }

            if (
                error.code ===
                "CATEGORY_TYPE_MISMATCH"
            ) {
                setError(
                    "A categoria não corresponde ao tipo da transação."
                );
                return;
            }

            setError(
                error.message ||
                    "Não foi possível salvar a transação."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {editing
                        ? "Editar transação"
                        : "Nova transação"}
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    Registre suas receitas e despesas.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div>
                    <label
                        htmlFor="tipo"
                        className="mb-2 block text-sm font-medium"
                    >
                        Tipo
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    >
                        <option value="despesa">
                            Despesa
                        </option>

                        <option value="receita">
                            Receita
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="contaId"
                        className="mb-2 block text-sm font-medium"
                    >
                        Conta
                    </label>

                    <select
                        id="contaId"
                        name="contaId"
                        value={form.contaId}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    >
                        <option value="">
                            Selecione uma conta
                        </option>

                        {accounts.map((account) => (
                            <option
                                key={account.id}
                                value={account.id}
                            >
                                {account.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="categoriaId"
                        className="mb-2 block text-sm font-medium"
                    >
                        Categoria
                    </label>

                    <select
                        id="categoriaId"
                        name="categoriaId"
                        value={form.categoriaId}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {filteredCategories.map(
                            (category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.nome}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="descricao"
                        className="mb-2 block text-sm font-medium"
                    >
                        Descrição
                    </label>

                    <input
                        id="descricao"
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        maxLength={255}
                        disabled={saving}
                        placeholder="Ex.: Supermercado"
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    />
                </div>

                <div>
                    <label
                        htmlFor="valor"
                        className="mb-2 block text-sm font-medium"
                    >
                        Valor
                    </label>

                    <input
                        id="valor"
                        name="valor"
                        type="number"
                        min="0.01"
                        step="0.01"
                        inputMode="decimal"
                        value={form.valor}
                        onChange={handleChange}
                        disabled={saving}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    />
                </div>

                <div>
                    <label
                        htmlFor="dataTransacao"
                        className="mb-2 block text-sm font-medium"
                    >
                        Data
                    </label>

                    <input
                        id="dataTransacao"
                        name="dataTransacao"
                        type="date"
                        value={form.dataTransacao}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    />
                </div>

                <div>
                    <label
                        htmlFor="observacao"
                        className="mb-2 block text-sm font-medium"
                    >
                        Observação
                    </label>

                    <textarea
                        id="observacao"
                        name="observacao"
                        value={form.observacao}
                        onChange={handleChange}
                        disabled={saving}
                        rows={3}
                        maxLength={2000}
                        placeholder="Opcional"
                        className="w-full resize-none rounded-lg border border-[var(--border)] bg-white px-3 py-2.5"
                    />
                </div>

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-[var(--red)] p-3 text-sm text-[var(--red)]"
                    >
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[var(--blue)] px-5 py-2.5 font-medium text-white disabled:opacity-60"
                    >
                        {saving
                            ? "Salvando..."
                            : editing
                                ? "Salvar alterações"
                                : "Criar transação"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={saving}
                            className="rounded-lg border border-[var(--border)] px-5 py-2.5"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}