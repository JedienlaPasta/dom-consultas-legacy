import mongoose from "mongoose";

const rolSchema = mongoose.Schema({
    COMUNA: Number,
    ANO: Number,
    SEMESTRE: Number,
    ASEO: String,
    RUT: Number,
    PROPIETARIO: String,
    DIRECCION: String,
    ROL_AVALUO_1: Number,
    ROL_AVALUO_2: Number,
    NA: String,
    CONTRIBUCION: Number,
    AVALUO_TOTAL: Number,
    AVALUO_EXENTO: Number,
    TER_EXEN: Number,
    UBICACION: String,
    DESTINO: String,
})

const RolData = mongoose.model('roles', rolSchema)

export default RolData