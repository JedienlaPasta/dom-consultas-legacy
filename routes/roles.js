import express from 'express'
import { getRoles, getRolesByRUT, getRolesByDIR } from '../controllers/roles.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/rol', authenticateToken, getRoles)
router.get('/rut', authenticateToken, getRolesByRUT)
router.get('/dir', authenticateToken, getRolesByDIR)

export default router