import mongoose from "mongoose";

const permisoSchema = mongoose.Schema({
    MATRIZ_V: {
        type: String,
        required: true
    },
    DIGITO_V: {
        type: String,
        required: true
    },
    MATRIZ_A: {
        type: String,
        required: false
    },
    DIGITO_A: {
        type: String,
        required: false
    },
    NOMBRE: {
        type: String,
        required: true
    },
    APELLIDO_P: {
        type: String,
        required: false
    },
    APELLIDO_M: {
        type: String,
        required: false
    },
    RUT: {
        type: String,
        required: false
    },
    DOMICILIO: {
        type: String,
        required: false
    },
    COMUNA: {
        type: String,
        required: false
    },
    TELEFONO: {
        type: String,
        required: false
    },
    MZ: {
        type: String,
        required: false
    },
    NSTPC: {
        type: String,
        required: false
    },
    CALLE: {
        type: String,
        required: false
    },
    SECTOR: {
        type: String,
        required: false
    },
    DESTINO: {
        type: String,
        required: false
    },
    N_VIV: {
        type: Number,
        required: true
    },
    M2_C_RECEP: {
        type: Number,
        required: true
    },
    M2_C_PERM: {
        type: Number,
        required: true
    },
    M2_S_PERM: {
        type: Number,
        required: true
    },
    M2_TOTAL: {
        type: Number,
        required: true
    },
    UI_NUM: {
        type: Number,
        required: true
    },
    UI_ANO: {
        type: Number,
        required: true
    },
    TIPO_EXPEDIENTE: {
        type: String,
        required: false
    },
    ESTADO: {
        type: String,
        required: false
    },
    DESDE: {
        type: String,
        required: false
    },
    DERECHOS: {
        type: Number,
        required: true
    },
    COMENTARIO: {
        type: String,
        required: false
    }
})

const Permiso = mongoose.model('permisos', permisoSchema)

export default Permiso