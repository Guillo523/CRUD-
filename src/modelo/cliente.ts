import * as mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    id: Number,
    nombre1: String,
    nombre2: String,
    apellido1: String,
    apellido2: String,
    telefono: String,
    celular: String,
    correo: String,
    relacion: [{
        estado: String,
        id: String
    }]
});

export const cliente = mongoose.model("cliente",clienteSchema);