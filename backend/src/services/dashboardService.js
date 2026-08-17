import { findDashboardTotalsByUserId, findRecentTransactionsByUserId } from "../repositories/dashboardRepository.js";
import { findAccountsByUserId } from "../repositories/accountRepository.js";

export async function getUserDashboard(usuarioId) {
    const [
        summary,
        accounts,
        recentTransactions,
    ] = await Promise.all([
        findDashboardTotalsByUserId(usuarioId),
        findAccountsByUserId(usuarioId),
        findRecentTransactionsByUserId(usuarioId),
    ]);

    return {
        summary,
        accounts,
        recentTransactions,
    };
}