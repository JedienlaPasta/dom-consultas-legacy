import mongoose from "mongoose"

export const logPermisoSchema = mongoose.Schema({
    MATRIZ_V: { type: String },
    DIGITO_V: { type: String },
    MATRIZ_A: { type: String },
    DIGITO_A: { type: String },
    NOMBRE: { type: String },
    APELLIDO_P: { type: String },
    APELLIDO_M: { type: String },
    RUT: { type: String },
    DOMICILIO: { type: String },
    COMUNA: { type: String },
    TELEFONO: { type: String },
    MZ: { type: String },
    NSTPC: { type: String },
    CALLE: { type: String },
    SECTOR: { type: String },
    DESTINO: { type: String },
    N_VIV: { type: Number },
    M2_C_RECEP: { type: Number },
    M2_C_PERM: { type: Number },
    M2_S_PERM: { type: Number },
    M2_TOTAL: { type: Number },
    UI_NUM: { type: Number },
    UI_ANO: { type: Number },
    TIPO_EXPEDIENTE: { type: String },
    ESTADO: { type: String },
    DESDE: { type: String },
    DERECHOS: { type: Number },
    COMENTARIO: { type: String }
}, { minimize: true } )

const LogPermiso = mongoose.model('logPermisos', logPermisoSchema)

export default LogPermiso