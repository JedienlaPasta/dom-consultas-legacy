import Permiso from "../models/permisosModel.js"
import { createLog } from "./logs.js"
import ObjectId from 'mongodb'
import RolData from "../models/rolesData.js"

const objId = ObjectId.ObjectId

export const getPermisoRolV = async (req, res) => {
    const roles = req.query
    let permisos
    if (roles.mz && roles.pd) {
        // aqui se buscan registros con los roles exactos, por lo que no hace falta hacer un $sort
        permisos = await Permiso.find({ MATRIZ_V: roles?.mz, DIGITO_V: roles?.pd })
    }
    else {
        permisos = await Permiso.aggregate([ 
            { $match: { MATRIZ_V: roles?.mz }},
            { $addFields: {"DIGITO_length": { $strLenCP: "$DIGITO_V" }}},
            { $sort: {"DIGITO_length": 1, "DIGITO_V": 1}},
            { $project: {"DIGITO_length": 0}}
        ])
    }
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    permisos.forEach(permiso => {
        const date = permiso?.DESDE
        const dateArray = date?.toString().split("-")
        const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
        permiso.DESDE = formatedDate
    })
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: 'Error inesperado' })
    }
}

export const getPermisoRolA = async (req, res) => {
    const roles = req.query
    let permiso
    if (roles.mz && roles.pd) {
        // aqui se buscan registros con los roles exactos, por lo que no hace falta hacer un $sort
        permiso = await Permiso.find({ MATRIZ_A: roles?.mz, DIGITO_A: roles?.pd })
    }
    else {
        permiso = await Permiso.aggregate([ 
            { $match: { MATRIZ_A: roles?.mz }},
            { $addFields: {"DIGITO_length": { $strLenCP: "$DIGITO_A" }}},
            { $sort: {"DIGITO_length": 1, "DIGITO_A": 1}},
            { $project: {"DIGITO_length": 0}}
        ])
    }
    if (!permiso.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    try {
        res.status(200).json(permiso)
    } catch (error) {
        res.status(404).json({ message: 'Error inesperado' })
    }
}

export const getPermisosByRUT = async (req, res) => {
    const rut = req.query?.rut
    const permisos = await Permiso.aggregate([
        { $match: { RUT: { $regex: rut, $options: 'i'} }},
        { $addFields: { "MATRIZ_length": { $strLenCP: "$MATRIZ_V"}, "DIGITO_length": { $strLenCP: "$DIGITO_V"} }},
        { $sort: { "MATRIZ_length": 1, "MATRIZ_V": 1, "DIGITO_length": 1, "DIGITO_V": 1 }},
        { $project: { "MATRIZ_length": 0, "DIGITO_length": 0 }}
    ])
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    permisos.forEach(permiso => {
        const date = permiso?.DESDE
        const dateArray = date?.toString().split("-")
        const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
        permiso.DESDE = formatedDate
    })
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPermisoByApellidoP = async (req, res) => {
    const apellido = req.query?.apellido
    // const permiso = await Permiso.find({ APELLIDO_P: apellido })
    // const permiso = await Permiso.find({ APELLIDO_P: { $regex: apellido, $options: 'i'} })
    // const permisos = await Permiso.aggregate([ 
    //     { $match: { APELLIDO_P: { $regex: apellido, $options: 'i'} }},
    //     { $addFields: { "MATRIZ_length": { $strLenCP: "$MATRIZ_V"}, "DIGITO_length": { $strLenCP: "$DIGITO_V"} }},
    //     { $sort: { "MATRIZ_length": 1, "MATRIZ_V": 1, "DIGITO_length": 1, "DIGITO_V": 1 }},
    //     { $project: { "MATRIZ_length": 0, "DIGITO_length": 0 }}
    // ])
    const permisos = await Permiso.find({ APELLIDO_P: apellido }).sort({ APELLIDO_M: 1 })
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    permisos.forEach(permiso => {
        const date = permiso?.DESDE
        const dateArray = date?.toString().split("-")
        const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
        permiso.DESDE = formatedDate
    })
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: 'Error inesperado' })
    }
}

export const getPermisoById = async (req, res) => {
    const id = req.query?.id
    const permisos = await Permiso.find({ _id: objId(id) })
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    permisos.forEach(permiso => {
        const date = permiso?.DESDE
        const dateArray = date?.toString().split("-")
        const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
        permiso.DESDE = formatedDate
    })
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: 'Error inesperado' })
    }
}

export const getPermisosByDIR = async (req, res) => {
    const dir = req.query?.dir
    // const permiso = await Permiso.find({ CALLE: {$regex: dir, $options: 'i'} })
    const permisos = await Permiso.aggregate([ 
        { $match: { CALLE: { $regex: dir, $options: 'i'} }},
        { $addFields: { "MATRIZ_length": { $strLenCP: "$MATRIZ_V"}, "DIGITO_length": { $strLenCP: "$DIGITO_V"} }},
        { $sort: { "MATRIZ_length": 1, "MATRIZ_V": 1, "DIGITO_length": 1, "DIGITO_V": 1 }},
        { $project: { "MATRIZ_length": 0, "DIGITO_length": 0 }}
    ])
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    permisos.forEach(permiso => {
        const date = permiso?.DESDE
        const dateArray = date?.toString().split("-")
        const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
        permiso.DESDE = formatedDate
    })
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: 'Error inesperado' })
    }
}

export const gerPermisosBySector = async (req, res) => {
    const sector = req.query.sector || 'empty'
    // const permiso = await Permiso.find({ SECTOR: {$regex: sector, $options: 'i'} })
    const permisos = await Permiso.aggregate([ 
        { $match: { SECTOR: { $regex: sector, $options: 'i'} }},
        { $addFields: { "MATRIZ_length": { $strLenCP: "$MATRIZ_V"}, "DIGITO_length": { $strLenCP: "$DIGITO_V"} }},
        { $sort: { "MATRIZ_length": 1, "MATRIZ_V": 1, "DIGITO_length": 1, "DIGITO_V": 1 }},
        { $project: { "MATRIZ_length": 0, "DIGITO_length": 0 }}
    ])
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    permisos.forEach(permiso => {
        const date = permiso?.DESDE
        const dateArray = date?.toString().split("-")
        const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
        permiso.DESDE = formatedDate
    })
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: 'Error inesperado' })
    }
}

// Usar en caso de requerir cambiar valores de la DB
// export const getM2Total = async (req, res) => {
//     // Devuelve la base de datos completa con los cambios especificados
//     // const permisos = await Permiso.aggregate([
//     //     {
//     //         $addFields: {
//     //             COMENTARIO: { $replaceAll: { input: "$COMENTARIO", find: "¡", replacement: "," } }
//     //         }
//     //     }
//     // ])

//     // Actualiza la base de datos completa en los campos especificados con los valores definidos
//     await RolData.updateMany(
//         { "PROPIETARIO": { $regex: /¡/ }},
//         [{
//             $set: {
//                 "PROPIETARIO": {
//                     $replaceAll: { input: "$PROPIETARIO", find: "¡", replacement: "," }
//                 },
//             }
//         }]
//     )
//     try {
//         res.status(200).json({ message: 'done' })
//     } catch (error) {
//         res.status(404).json({ message:error.message })
//     }
// }

// get timestamps
// const timeStamp = permisos.map(permiso => permiso._id.getTimestamp())
// console.log(timeStamp)

export const getM2Total = async (req, res) => {
    const permisos = await Permiso.aggregate([
        {
            $group: {
                _id: 'M2_TOTALES',
                N_VIV: { $sum: '$N_VIV' },
                M2_C_RECEP: { $sum: '$M2_C_RECEP' },
                M2_C_PERM: { $sum: '$M2_C_PERM' },
                M2_S_PERM: { $sum: '$M2_S_PERM' },
                M2_TOTAL: { $sum: '$M2_TOTAL' },
            }
        }
    ])
    
    if (!permisos.length) {
        return res.status(404).json({ message: 'No se encontraron coincidencias' })
    }
    try {
        res.status(200).json(permisos)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPermiso = async (req, res) => {
    const permiso = req.body?.permiso
    const date = permiso?.DESDE
    const dateArray = date?.toString().split("-")
    const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
    permiso.DESDE = formatedDate

    const newPermiso = new Permiso(permiso)
    req.permiso = newPermiso
    req.action = 'CREAR'
    try {
        await newPermiso.save()
        await createLog(req)
        res.status(201).json({ message: 'Permiso ingresado exitosamente'})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
    }
    // =================================================
    // console.log(newPermiso._id.getTimestamp())
}

export const updatePermiso = async (req, res) => {
    const permiso = req.body?.permiso
    const date = permiso?.DESDE
    const dateArray = date?.toString().split("-")
    const formatedDate = (dateArray[0] !== '' && `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`) || ''
    permiso.DESDE = formatedDate
    // console.log(permiso)

    const toUpdate = await Permiso.findOne({ _id: permiso?._id })
    if (!toUpdate) {
        console.log('este permiso no existe')
        return res.status(404).json({ message: 'Este permiso no existe' })
    }
    req.action = 'EDITAR'
    // se cambian los valores del documento guardado en la DB por los nuevos valores enviados en el body
    // Object.keys(toUpdate.toJSON()).forEach((key) => permiso[key] && (toUpdate[key] = permiso[key]))
    // Object.keys(newPermiso).forEach(key => newPermiso[key] = roles[rolIndex]?.[key] || (typeof roles[rolIndex]?.[key] == 'number' ? 0 : ''))
    // quizas esto no hace falta, pero no estaria de mas dejarlo por si acaso?
    Object.keys(toUpdate.toJSON()).forEach((key) => key !== '__v' && (toUpdate[key] = permiso[key] || (typeof permiso[key] == 'number' ? 0 : '')))
    try {
        await createLog(req)
        // ss
        await toUpdate.save()
        console.log('permiso actualizado exitosamente')
        res.status(200).json({ message: 'Permiso actualizado exitosamente' })
    } catch (error) {
        console.log('no se pudo actualizar el permiso')
        res.status(400).json({ message: error.message }) // 400?
    }
}

export const deletePermiso = async (req, res) => {
    const id = req.params.id
    // console.log(req.body)
    const toDelete = await Permiso.findOne({ _id: id })
    if (!toDelete) {
        console.log('este permiso no existe')
        return res.status(404).json({ message: 'Este permiso no existe' })
    }
    req.action = 'ELIMINAR'
    try {
        await createLog(req)
        // ss
        await Permiso.deleteOne({ _id: toDelete._id })
        console.log('permiso eliminado exitosamente')
        res.status(200).json({ message: 'Permiso eliminado exitosamente' })
    } catch (error) {
        console.log('no se pudo eliminar el permiso')
        res.status(400).json({ message: 'No se pudo eliminar el permiso' })
    }
}
