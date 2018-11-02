"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
            id: String,
            estado: String
        }]
});
exports.cliente = mongoose.model("cliente", clienteSchema);
//# sourceMappingURL=cliente.js.map