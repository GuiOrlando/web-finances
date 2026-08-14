import { apiFetch } from "./api.js";

export function getCategories() {
    return apiFetch("/api/categories");
}

export function createCategory(data) {
    return apiFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateCategory(id, data) {
    return apiFetch(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export function deactivateCategory(id) {
    return apiFetch(`/api/categories/${id}`, {
        method: "DELETE",
    });
}