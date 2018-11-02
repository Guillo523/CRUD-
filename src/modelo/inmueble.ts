import * as mongoose from "mongoose";

const inmuebleSchema = new mongoose.Schema({
    id: Number,
    direccion: String,
    tipo: String,
    canon: Number,
    estrato: Number,
    estado: String
});

export const inmueble = mongoose.model("inmueble",inmuebleSchema);