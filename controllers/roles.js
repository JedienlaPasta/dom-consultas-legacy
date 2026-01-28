import RolData from "../models/rolesData.js";

export const getRoles = async (req, res) => {
    const roles = req.query
    let rolesData
    // esto es en caso de que el rol2 sea ''
    if (roles.mz && roles.pd) {
        rolesData = await RolData.find({ ROL_AVALUO_1: roles?.mz, ROL_AVALUO_2: roles?.pd })
    }
    else {
        // aqui no puedo $sortear igual que en los permisos, porque rol1 y rol2 son valores numericos
        rolesData = await RolData.find({ ROL_AVALUO_1: roles?.mz }).sort({'ROL_AVALUO_2': 1})
    }
    // en caso de no encontrar coincidencias
    if (!rolesData.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    try {
        res.status(200).json(rolesData)
    } catch (error) {
        res.status(404).json({ message: 'No se encontraron resultados' })
    }
}

export const getRolesByRUT = async (req, res) => {
    const rut = req.query.rut
    const reg = await RolData.find({ RUT: rut }).sort({'ROL_AVALUO_1': 1, 'ROL_AVALUO_2': 1})
    if (!reg.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    try {
        res.status(200).json(reg)
    } catch (error) {
        res.status(404).json({ message: 'No se encontraron resultados' })
    }
}

export const getRolesByDIR = async (req, res) => {
    const dir = req.query.dir || 'empty'
    const reg = await RolData.find({ DIRECCION: {$regex: dir, $options: 'i'} }).sort({'ROL_AVALUO_1': 1, 'ROL_AVALUO_2': 1})
    if (!reg.length){
        return res.status(404).json({ message: 'No se encontraron coincidencias'})
    }
    try {
        res.status(200).json(reg)
    } catch (error) {
        res.status(404).json({ message: 'No se encontraron resultados' })
    }
}