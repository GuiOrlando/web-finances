import { getHealthStatus } from "../services/healthService.js";

export async function getHealth(req, res) {
    const healthStatus = await getHealthStatus();

    return res.status(200).json({
        data: healthStatus,
    });
}