// importamos express para crear un servido http
import * as express from "express";
import * as parser from "body-parser";
import * as mongoose from "mongoose";
import { inmueble } from "./modelo/inmueble";
import { cliente } from "./modelo/cliente";

//verificar conecion a la base de datos en este caso con contraseña: se coloca despues de los // despues del @ el localhost con el puerto
//mongodb://<usuario>:<contraseña>@<host>:<puerto>/<nombre db>
mongoose.connect("mongodb://guillermo:123456@167.99.236.155:27017/guille", function (error){

    if (error) throw error;
    console.log("Conexion exitosa");

});

//creamos una aplicacion nueva de express
const app = express();

// convierte los datos que llegan a Json
app.use(parser.json());
app.use(parser.urlencoded({extended:true}))

//escuchar a la ruta (test) cuando le hagan una peticion de tipo get
app.route("/test").get((req, res) => {
    
    //retorna un json que diga funciono = true
    return res.json({funciono: true});
});

app.route("/test").post((req, res) =>{
   // const nombre = req.body.nombre;
    //return res.json({nombre: nombre});

    const id = req.body.Codigo;   
    const barrio = req.body.Barrio;
    const estrato = req.body.Estrato;
    const canon = estrato * 1000000;
    const tipo = req.body.Tipo;
    const estado = req.body.estado;
   
    return res.json({Id: id, Barrio: barrio, Estrato: estrato, Canon: canon, Tipo: tipo, Estado: estado});
});

app.route("/test/:id").get((req, res) => {

    const propiedad = req.params.id;
    return res.json({id: propiedad});
});
/**
 * hasta aqui fue la conexion a la base de datos y un ejemplo de como 
 * se implementaría.
 */

 //se crea un documento inmueble en mongoDB con sus caracteristicas.
 app.route("/inmueble").post((req, res) => {
    const nuevo = {
        id: req.body.id,
        direccion: req.body.direccion,
        tipo: req.body.tipo,
        canon: req.body.canon,
        estrato: req.body.estrato,
        estado: req.body.estado
    };
    inmueble.create(nuevo).then(() => {
        return res.json("Guardado");
    }).catch(()=> {
        return res.json("Hubo un error");
    })
});
// se crea documento en mongodb de cliente 
app.route("/cliente").post((req, res) => {
    const newCliente = {
        id: req.body.id,
        nombre1: req.body.nombre1,
        nombre2: req.body.nombre2,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2,
        telefono: req.body.telefono,
        celular: req.body.celular,
        correo: req.body.correo
    };
    cliente.create(newCliente).then(() => {
        return res.json("se creo documento");
    }).catch((error) => {
        return res.json({error: "Hubo un error al crear el documento", mensaje: error});
    })
});

/*se lee y muestra en el postman un documento guardado con
posterioridad en mongo DB*/ 
app.route("/inmueble/:id").get((req, res) =>{
    const id = req.params.id;
    inmueble.findOne({id: id}).then((data) =>{
        if (data){
            return res.json(data);
        }else{
            return res.json("No se encuentra el id");
        }
    }).catch(() =>{
        return res.json("Hubo un error consultando");
    })
});
// se lee y muestra campos del documento cliente guardado en mongodb
app.route("/cliente/:id").get((req, res) =>{
    const id = req.params.id;
    cliente.findOne({id: id}).then((data) =>{
        if (data){
            return res.json(data);
        }else{
            return res.json("No se encuentra el id");
        }
    }).catch(() =>{
        return res.json("Hubo un error consultando el documento");
    })
});
//se modifica un campo del documento inmueble
app.route("/inmueble/:id").patch((req, res) =>{
    const id = req.params.id;
    const nuevoCanon = req.body.canon;
    inmueble.findOneAndUpdate({id: id},{canon: nuevoCanon}).then((data) =>{
        return res.json("Se actualizo un registro");
    }).catch(()=>{
        return res.json("error");
    })    
});

app.route("/cliente/:id").patch((req, res) =>{
    const id = req.params.id;
    const nuevoCel = req.body.celular;
    const nuevoCorreo = req.body.correo;
    cliente.findOneAndUpdate({id: id},{celular: nuevoCel,correo: nuevoCorreo}).then((data) =>{
        return res.json("Se actualizaron los registros");
    }).catch(() =>{
        return res.json("error");
    })
});
//se borra un documento de la tabla inmueble
app.route("/inmueble/:id").delete((req, res) =>{
    const id = req.params.id;
    inmueble.findOneAndDelete({id: id}).then((data) =>{
        return res.json("Se borro registro");
    }).catch(() =>{
        return res.json("error");
    })
});

app.route("/cliente/:id").delete((req, res) =>{
    const id =req.params.id;
    cliente.findOneAndDelete({id: id}).then((data) =>{
        return res.json("Se borro registro");
    }).catch(() =>{
        return res.json("error");
    })
});

app.route("/cliente/:clienteId/inmueble/:inmuebleId").post((req, res) =>{
    const inmuebleId = req.params.inmuebleId;
    const clienteId = req.params.clienteId;

    cliente.findOne({id: clienteId}).then((data: any) => {
        if (data){
            cliente.find({"relacion.id": inmuebleId}).then((respuesta) =>{
                if (respuesta.length > 0){
                    return res.json("inmueble no disponible")
                }else{
                    inmueble.findOne({id: inmuebleId}).then((resp: any) => {
                        if (resp){
                            const relacion = {
                                estado: resp.estado,
                                id: inmuebleId
                            }                    
                            data.relacion.push(relacion)
                            cliente.update({id: clienteId},data).then((resultado) =>{
                                return res.json(resultado)
                            })
                        }else{
                            return res.json("el inmueble no se encuentra")
                        }
                    })
                    
                }
                
            })
        }else{
            return res.json("Usuario no existe")
        }
    })
})
// para inicializar el servidor
app.listen(3000, ()=> {
    console.log("El servidor esta corriendo");
});
