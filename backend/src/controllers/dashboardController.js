import { getUserDashboard } from "../services/dashboardService.js";

export async function getDashboard(req, res) {
    const dashboard =
        await getUserDashboard(
            req.auth.user.id
        );

    res.set(
        "Cache-Control",
        "no-store"
    );

    return res.status(200).json({
        data: dashboard,
    });
}