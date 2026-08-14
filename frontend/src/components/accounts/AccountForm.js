"use client";

import { useState } from "react";
import { createAccount, updateAccount } from "../../services/accounts.js";

const INITIAL_FORM = {
    nome: "",
    tipo: "corrente",
    saldoInicial: "0.00",
};

function getInitialForm(account) {
    if (!account) {
        return INITIAL_FORM;
    }

    return {
        nome: account.nome,
        tipo: account.tipo,
        saldoInicial:
            account.saldoInicial ?? "0.00",
    };
}

export default function AccountForm({
    account,
    onSaved,
    onCancel,
    onUnauthorized,
}) {
    const [form, setForm] = useState(
        () => getInitialForm(account)
    );

    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    const editing = Boolean(account);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");

        if (!form.nome.trim()) {
            setErro("Informe o nome da conta.");
            return;
        };

        try {
            setSalvando(true);

            const payload = {
                nome: form.nome.trim(),
                tipo: form.tipo,
                saldoInicial:
                    form.saldoInicial || "0.00",
            };

            if (editing) {
                await updateAccount(
                    account.id,
                    payload
                );
            } else {
                await createAccount(payload);
            }

            setForm(INITIAL_FORM);

            await onSaved();
        } catch (error) {
            if (error.status === 401) {
                onUnauthorized();
                return;
            }

            setErro(
                error.message ||
                    "Não foi possível salvar a conta."
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {editing
                        ? "Editar conta"
                        : "Nova conta"}
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    {editing
                        ? "Atualize os dados da conta."
                        : "Cadastre uma conta para organizar suas finanças."}
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
                        disabled={salvando}
                        placeholder="Ex.: Conta principal"
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-[var(--blue)]"
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
                        disabled={salvando}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none focus:border-[var(--blue)]"
                    >
                        <option value="corrente">
                            Conta corrente
                        </option>

                        <option value="poupanca">
                            Poupança
                        </option>

                        <option value="carteira">
                            Carteira
                        </option>

                        <option value="investimento">
                            Investimento
                        </option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="saldoInicial"
                        className="mb-2 block text-sm font-medium text-[var(--foreground)]"
                    >
                        Saldo inicial
                    </label>

                    <input
                        id="saldoInicial"
                        name="saldoInicial"
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        value={form.saldoInicial}
                        onChange={handleChange}
                        disabled={salvando}
                        className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[var(--foreground)] outline-none focus:border-[var(--blue)]"
                    />
                </div>

                {erro && (
                    <div
                        role="alert"
                        className="rounded-lg border border-[var(--red)] px-4 py-3 text-sm text-[var(--red)]"
                    >
                        {erro}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={salvando}
                        className="rounded-lg bg-[var(--blue)] px-5 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {salvando
                            ? "Salvando..."
                            : editing
                                ? "Salvar alterações"
                                : "Criar conta"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={salvando}
                            className="rounded-lg border border-[var(--border)] px-5 py-2.5 font-medium text-[var(--foreground)]"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}