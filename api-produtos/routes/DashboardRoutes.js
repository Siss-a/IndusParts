import express from "express";
import DashboardController from "../controllers/DashboardController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, DashboardController.resumo);

export default router;
