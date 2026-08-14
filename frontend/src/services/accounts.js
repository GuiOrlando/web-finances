import { apiFetch } from "./api.js";

export function getAccounts() {
    return apiFetch("/api/accounts");
}

export function createAccount(data) {
    return apiFetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateAccount(id, data) {
    return apiFetch(`/api/accounts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export function deactivateAccount(id) {
    return apiFetch(`/api/accounts/${id}`, {
        method: "DELETE",
    });
}