import LogPermiso from "../models/logPermiso.js"
import Log from "../models/logs.js"
import Permiso from "../models/permisosModel.js"
import mongoose from 'mongoose'

const objId = (hex24) => new mongoose.Types.ObjectId(String(hex24).padStart(24, '0'))

// Para consultar logs guardados
export const getLogs = async (req, res) => {
    const option = req.query?.option
    const date = req.query?.date
    const id = req.query?.id
    const rolMz = req.query?.['rol[mz]']
    const rolPd = req.query?.['rol[pd]']
    let logs = []
    
    try {
        // Busqueda por Fecha
        if (option === 'fecha' && date !== '') {
            // Fecha YYYY-MM-DD enviada por el frontend = DÍA EN HORA LOCAL (Chile)
            const [y, m, d] = date.split('-').map(Number)
            
            // ▶ Start: 00:00:00 HORA LOCAL del día seleccionado
            const startDate = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0)
            const startTs = Math.floor(startDate.getTime() / 1000) // getTime() ya devuelve UTC
            const start = objId(startTs.toString(16).padStart(8, '0') + "0000000000000000")
            
            // ▶ End: 00:00:00 HORA LOCAL del DÍA SIGUIENTE (rango [start, end) cierra por la derecha)
            const endDate = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0)
            endDate.setDate(endDate.getDate() + 1)
            const endTs = Math.floor(endDate.getTime() / 1000)
            const end = objId(endTs.toString(16).padStart(8, '0') + "0000000000000000")
            
            logs = await Log.find({ _id: { $gte: start, $lt: end } }).sort([['_id', -1]])
        }
        else if (option === 'id' && id !== '') {
            logs = await Log.find({ permisoId: id }).sort([['_id', -1]])
        }
        // Busqueda por Rol
        else if (option === 'rol' && (rolMz !== '' || rolPd !== '')) {
            if (rolMz !== '' && rolPd !== '' ) {
                logs = await Log.find({ matriz: rolMz, digito: rolPd }).sort([['_id', -1]])
            }
            else if (rolMz !== '' ) {
                logs = await Log.find({ matriz: rolMz }).sort([['_id', -1]])
            }
        }
        // Busqueda por ID
        else {
            logs = await Log.find().sort([['_id', -1]])
        }
    } catch (error) {
        console.error("\n[getLogs] ERROR en la query:", error?.message || error)
        console.error("  Stack:", error?.stack)
        if (!logs.length) {
            return res.status(500).json({ message: 'Error al buscar registros', error: error?.message || String(error) })
        }
    }
    if (!logs.length) {
        return res.status(404).json({ message: 'No se encontraron registros' })
    }
    logs = logs.map(log => (
        {...log._doc, date: log._id.getTimestamp()}
    ));
    try {
        res.status(200).json(logs)
    } catch (error) {
        res.status(400).json({ message: 'Error inesperado' })
    }
}

// Para crear logs nuevos
export const createLog = async (req, res) => { 
    let logInfo
    let insertLog = true
    if (req.action === 'CREAR') {
        const newPermisoLog = req.permiso?._doc
        // Se les asigna undefined a los campos con valores vacios: '' y 0
        Object.keys(newPermisoLog).forEach((key) => !newPermisoLog[key] ? newPermisoLog[key] = undefined : null)
        const logPermisoToInsert = await new LogPermiso(newPermisoLog)
        logInfo = {
            permisoId: newPermisoLog._id,
            matriz: newPermisoLog.MATRIZ_V,
            digito: newPermisoLog.DIGITO_V,
            user: req.body.user.name,
            action: req.action,
            newVal: logPermisoToInsert
        }
    }
    else if (req.action === 'EDITAR') {
        let newPermiso = req.body?.permiso
        const matriz = req.body?.permiso.MATRIZ_V
        const digito = req.body?.permiso.DIGITO_V
        const id = newPermiso?._id
        let oldPermiso = await Permiso.findOne({ _id: id })
        oldPermiso = oldPermiso._doc

        // Se crea un array con las llaves de los campos que no cambiaron durante esta accion
        const keys = Object.keys(newPermiso).filter((key) => newPermiso[key] !== oldPermiso[key] && key !== '_id')
        // Se les asigna un valor 'undefined' a los campos que no cambiaron, esto provoca que el objeto creado solo tenga campos con valores relevantes
        Object.keys(newPermiso).forEach((key) => !keys.includes(key) ? newPermiso[key] = undefined : null)
        Object.keys(oldPermiso).forEach((key) => !keys.includes(key) ? oldPermiso[key] = undefined : null)
        // Se crean los objetos, estos son un poco distintos a los Permisos, ya que estos tienen la propiedad 'minimize' activada
        const logPermisoToInsert = await new LogPermiso(newPermiso)
        const logOldPermisoToInsert = await new LogPermiso(oldPermiso)
        logInfo = {
            permisoId: id,
            matriz: matriz,
            digito: digito,
            user: req.body.user.name,
            action: req.action,
            newVal: logPermisoToInsert,
            previousVal: logOldPermisoToInsert
        }
        insertLog = keys.length > 0
    }
    else if (req.action === 'ELIMINAR') {
        const id = req.params?.id
        let oldPermiso = await Permiso.findOne({ _id: id })
        oldPermiso = oldPermiso._doc
        const username = req.body?.username
        
        Object.keys(oldPermiso).forEach((key) => !oldPermiso[key] ? oldPermiso[key] = undefined : null)
        const logOldPermisoToInsert = await new LogPermiso(oldPermiso)
        logInfo = {
            permisoId: id,
            matriz: oldPermiso.MATRIZ_V,
            digito: oldPermiso.DIGITO_V,
            user: username,
            action: req.action,
            previousVal: logOldPermisoToInsert
        }
    }
    const logToInsert = new Log(logInfo)
    console.log(logToInsert)

    // ss

    try {
        if (insertLog) {
            await logToInsert.save()
        }
    } catch (error) {
        console.log(error)
    }
}