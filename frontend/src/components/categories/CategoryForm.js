"use client";
import { useState } from "react";
import { createCategory, updateCategory } from "../../services/categories.js";

const INITIAL_FORM = {
    nome: "",
    tipo: "despesa",
};

function getInitialForm(category) {
    if (!category) {
        return {
            ...INITIAL_FORM,
        };
    }

    return {
        nome: category.nome,
        tipo: category.tipo,
    };
}

export default function CategoryForm({category, onSaved, onCancel, onUnauthorized,}) {
    const [form, setForm] = useState(() => getInitialForm(category));
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const editing = Boolean(category);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!form.nome.trim()) {
            setError(
                "Informe o nome da categoria."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                nome: form.nome.trim(),
                tipo: form.tipo,
            };

            if (editing) {
                await updateCategory(category.id, payload);
            } else {
                await createCategory(payload);
            }

            setForm({
                ...INITIAL_FORM,
            });

            await onSaved();
        } catch (error) {
            if (error.status === 401) {
                onUnauthorized();
                return;
            }

            if (error.code === "CATEGORY_ALREADY_EXISTS") {
                setError("Essa categoria já está cadastrada.");
                return;
            }

            setError(
                error.message || "Não foi possível salvar a categoria."
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
                        ? "Editar categoria"
                        : "Nova categoria"}
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    {editing
                        ? "Atualize os dados da categoria."
                        : "Crie categorias para organizar suas receitas."}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div>
                    <label
                        htmlFor="nome"
                        className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                        Nome
                    </label>

                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        maxLength={100}
                        value={form.nome}
                        onChange={handleChange}
                        disabled={saving}
                        placeholder="Ex.: Alimentação"
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-[var(--blue)] disabled:opacity-60"
                    />
                </div>

                <div>
                    <label
                        htmlFor="tipo"
                        className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                        Tipo
                    </label>

                    <select
                        id="tipo"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-[var(--blue)] disabled:opacity-60"
                    >
                        <option value="despesa">
                            Despesa
                        </option>

                        <option value="receita">
                            Receita
                        </option>
                    </select>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-[var(--red)] px-4 py-3 text-sm text-[var(--red)]"
                    >
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[var(--blue)] px-5 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {saving
                            ? "Salvando..."
                            : editing
                                ? "Salvar alterações"
                                : "Criar categoria"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={saving}
                            className="rounded-lg border border-[var(--border)] px-5 py-2.5 font-medium text-[var(--foreground)] transition hover:bg-[var(--background)] disabled:opacity-60"
                        >
                            Cancelar
                        </button>   
                    )}
                </div>
            </form>
        </section>
    );
}