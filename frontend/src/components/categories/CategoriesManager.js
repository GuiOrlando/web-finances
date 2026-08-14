"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CategoryCard from "./CategoryCard.js";
import CategoryForm from "./CategoryForm.js";
import { deactivateCategory, getCategories } from "../../services/categories.js";

export default function CategoriesManager() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    function handleUnauthorized() {
        router.replace("/login");
    }

    async function refreshCategories() {
        try {
            const response = await getCategories();

            setCategories(
                response.data.categories
            );

            setError("");
        } catch (error) {
            if (error.status === 401) {
                handleUnauthorized();
                return;
            }

            setError("Não foi possível carregar suas categorias.")
        };
    }

    useEffect(() => {
        let cancelled = false;

        async function initialLoad() {
            try {
                const response = await getCategories();

                if (cancelled) {
                    return;
                }

                setCategories(
                    response.data.categories
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                if (error.status === 401) {
                    router.replace("/login");
                    return;
                }

                setError("Não foi possível carregar suas categorias.");
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        initialLoad();

        return () => {
            cancelled = true;
        }
    }, [router]);

    async function handleDeactivate(category) {
        const confirmed = window.confirm(`Deseja desativar a categoria "${category.nome}"?`);

        if (!confirmed) {
            return;
        }

        try {
            setProcessing(true);

            await deactivateCategory(category.id);

            if (editingCategory?.id === category.id) {
                setEditingCategory(null);
            }

            await refreshCategories();
        } catch (error) {
            if (error.status === 401) {
                handleUnauthorized();
                return;
            }

            setError("Não foi possível desativar a categoria.");
        } finally {
            setProcessing(false);
        }
    }

    const incomeCategories =
        categories.filter(
            (category) =>
                category.tipo === "receita"
        );

    const expenseCategories =
        categories.filter(
            (category) =>
                category.tipo === "despesa"
        );

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-6">
                <p className="text-[var(--muted)]">
                    Carregando categorias...
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
                            Categorias
                        </h1>
                    </div>

                    <Link
                        href="/dashboard"
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--background)]"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[360px_1fr]">
                <CategoryForm
                    key={
                        editingCategory
                            ? `edit-${editingCategory.id}`
                            : "new"
                    }
                    category={editingCategory}
                    onSaved={async () => {
                        setEditingCategory(null);
                        await refreshCategories();
                    }}
                    onCancel={() =>
                        setEditingCategory(null)
                    }
                    onUnauthorized={
                        handleUnauthorized
                    }
                />

                <section>
                    {error && (
                        <div
                            role="alert"
                            className="mb-6 rounded-lg border border-[var(--red)] p-4 text-sm text-[var(--red)]"
                        >
                            {error}
                        </div>
                    )}

                    <CategoryGroup
                        title="Receitas"
                        description="Categorias utilizadas para entradas de dinheiro."
                        categories={
                            incomeCategories
                        }
                        emptyMessage="Nenhuma categoria de receita cadastrada."
                        onEdit={
                            setEditingCategory
                        }
                        onDeactivate={
                            handleDeactivate
                        }
                        disabled={
                            processing
                        }
                    />

                    <div className="mt-8">
                        <CategoryGroup
                            title="Despesas"
                            description="Categorias utilizadas para saídas de dinheiro."
                            categories={
                                expenseCategories
                            }
                            emptyMessage="Nenhuma categoria de despesa cadastrada."
                            onEdit={
                                setEditingCategory
                            }
                            onDeactivate={
                                handleDeactivate
                            }
                            disabled={
                                processing
                            }
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}

function CategoryGroup({title, description, categories, emptyMessage, onEdit, onDeactivate, disabled,}) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                    {description}
                </p>
            </div>

            {categories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
                    <p className="text-sm text-[var(--muted)]">
                        {emptyMessage}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {categories.map(
                        (category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={onEdit}
                                onDeactivate={onDeactivate}
                                disabled={disabled}
                            />
                        )
                    )}
                </div>
            )}
        </section>
    );
}