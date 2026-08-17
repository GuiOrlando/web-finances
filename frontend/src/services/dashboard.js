import { apiFetch } from "./api.js";

export function getDashboardSummary() {
    return apiFetch("/api/dashboard/summary");
}