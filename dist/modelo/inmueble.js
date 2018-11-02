"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const inmuebleSchema = new mongoose.Schema({
    id: Number,
    direccion: String,
    tipo: String,
    canon: Number,
    estrato: Number,
    estado: String
});
exports.inmueble = mongoose.model("inmueble", inmuebleSchema);
//# sourceMappingURL=inmueble.js.map