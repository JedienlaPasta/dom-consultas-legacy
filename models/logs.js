import mongoose from "mongoose";
import { logPermisoSchema } from "./logPermiso.js";

const logsSchema = mongoose.Schema({
    permisoId: {        // id del permiso que se actualiza, crea o elimina
        type: String,
        required: true
    },
    // Aqui se guarda solo el rol vigente, no el asignado
    matriz: {
        type: String,
        required: true
    },
    digito: {
        type: String,
        required: true
    },
    user: {             // nombre del usuario que realiza la accion
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREAR', 'EDITAR', 'ELIMINAR']
    },
    // si o si tiene que guardarse este valor aparte del que se almacena en permisos, porque este es el valor antes de ser cambiado, luego de esto el permiso puede cambiar varias veces pero este registro debe seguir igual
    previousVal: {      // el valor antes de ser cambiado, no es obligatorio en el caso de POST. Para DELETE, quizas debiese ingresarse el valor completo, o los campos borrados con valores !== '' || 0
        type: [logPermisoSchema]
    },
    newVal: {           // nuevo valor ingresado
        type: [logPermisoSchema],
        required: true
    }
})

const Log = mongoose.model('logs', logsSchema)

export default Log

// MATRIZ: String,
// DIGITO: String,
// NOMBRE: String,
// APELLIDO_P: String,
// APELLIDO_M: String,
// DOMICILIO: String,
// COMUNA: String,
// TELEFONO: String,
// MZ: String,
// NSTPC: String,
// CALLE: String,
// SECTOR: String,
// DESTINO: String,
// N_VIV: Number,
// M2_C_RECEP: Number,
// M2_C_PERM: Number,
// M2_S_PERM: Number,
// M2_TOTAL: Number,
// UI_NUM: Number,
// UI_ANO: Number,
// TIPO_EXPEDIENTE: String,
// ESTADO: String,
// DESDE: String,
// DERECHOS: Number,
// COMENTARIO: String,