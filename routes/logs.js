import express from "express";
import { createLog, getLogs } from "../controllers/logs.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get('/', authenticateToken, getLogs)
router.post('/', authenticateToken, createLog)

export default router