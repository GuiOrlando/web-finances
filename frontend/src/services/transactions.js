import { apiFetch } from "./api.js";

export function getTransactions() {
    return apiFetch("/api/transactions");
}

export function createTransaction(data) {
    return apiFetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateTransaction(id, data) {
    return apiFetch(`/api/transactions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function deleteTransaction(id) {
    return apiFetch(`/api/transactions/${id}`, {
        method: "DELETE",
    });
}