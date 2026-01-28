import express from 'express'
import { getPermisoRolV, getPermisoRolA, getPermisoByApellidoP, getPermisosByDIR, createPermiso, updatePermiso ,deletePermiso, exportPermisos, gerPermisosBySector, getM2Total, getPermisosByRUT, getPermisoById, createFile } from '../controllers/permisos.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/rol/vigente', authenticateToken, getPermisoRolV)
router.get('/rol/asignado', authenticateToken, getPermisoRolA)
router.get('/rut', authenticateToken, getPermisosByRUT)
router.get('/apellido', authenticateToken, getPermisoByApellidoP)
router.get('/id', authenticateToken, getPermisoById)
router.get('/dir', authenticateToken, getPermisosByDIR)
router.get('/sector', authenticateToken, gerPermisosBySector)
router.get('/m2total', authenticateToken, getM2Total)
router.get('/exportpermisos', authenticateToken, exportPermisos)
router.post('/create', authenticateToken, createPermiso)
router.patch('/update', authenticateToken, updatePermiso)
router.delete('/delete/:id', authenticateToken, deletePermiso)
router.get('/backup', createFile)

export default router