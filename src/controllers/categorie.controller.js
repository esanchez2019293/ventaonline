'use strict'


var Categoria = require("../models/categorie.model");
var Producto = require("../models/product.model");
var idDefault;


function agregarDefault(req, res) {

    var categoriaModel = new Categoria();

    categoriaModel.nombre = 'Default'

    Categoria.find({ nombre: categoriaModel.nombre }).exec((err, categoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
            return ('La categoria ya existe')
        } else {

            categoriaModel.save((err, categoriaGuardada) => {
                if (err) console.log('Error al almacenar la categoria la categoria');
                if (categoriaGuardada) {
                    console.log('Categoria del default ya esta  creada')
                } else {

                    console.log('No se puede almacenar la categoria')

                }

            })
        }
    })


}

function buscarDefault(req,res) {
    Categoria.findOne({nombre: 'Default'}).exec((err,categoriaEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'})
        if(!categoriaEncontrado) console.log('El producto  no existe')
        if(categoriaEncontrado) console.log('categoria del default ya de puede encontrado')
        idDefault = categoriaEncontrado;

    })
}

function AgregarCategorie(req, res) {

    var categoriaModel = new Categoria();
    var params = req.body;

    agregarDefault();
    buscarDefault();

    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No hay  permisos para poner una Categoria' })
    }

    if (params.nombre) {

        categoriaModel.nombre = params.nombre

        Categoria.find({ nombre: params.nombre }).exec((err, categoriaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
                return res.status(500).send({ mensaje: 'La categoria ya existe' })
            } else {

                categoriaModel.save((err, categoriaGuardada) => {
                    if (err) return res.status(500).send({ mensaje: 'Error al almacenar la categoria' });
                    if (categoriaGuardada) {
                        return res.status(200).send({ categoriaGuardada })
                    } else {

                        return res.status(500).send({ mensaje: 'No se puede guardadar esta categoria' })

                    }

                })
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'hay que ingresar los parametros necesarios' })
    }

}


function mostrarCategories(req, res) {
    
    Categoria.find().exec((err, Categoria) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!Categoria) return res.status(500).send({ mensaje: 'No hay ninguna categoria' })
        if (Categoria) return res.status(200).send({ Categoria })
    })

}

function updateCategories(req, res) {
    var idCategoria = req.params.id;
    var params = req.body;

    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No hay permisos para actualizar esta categoria' })
    }

    Categoria.find({nombre: params.nombre}).exec((err, categoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })


        if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
            return res.status(500).send({ mensaje: 'Este nombre que queremos editar ya existe' })
        } else {
            Categoria.findOne({ _id: idCategoria }).exec((err, categoriaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion al lograr este Empleado' });

                if (!categoriaEncontrada) return res.status(500).send({ mensaje: 'Error en la peticion al actualizar o no hay  datos' });
                
                if(categoriaEncontrada.nombre === 'Default' ) return res.status(500).send({mensaje:'No hay permisos para actualizar esta categoria'})


                Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, categoriaActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

                    if (!categoriaActualizado) return res.status(500).send({ mensaje: 'No se podido actualzar el empleado' })


                    if (categoriaActualizado) {
                        return res.status(200).send({ categoriaActualizado });
                    }

                })

            })

        }
    })
        

}

function deleteCategories(req, res) {
    var idCategoria = req.params.id;
    var params = req.body
    buscarDefault()

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(500).send({mensaje: 'No hay permiso para Eliminar categorias'})
    }

    Categoria.findOne({_id: idCategoria}).exec((err,categoriaEncontrada)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'})
        if(!categoriaEncontrada) return res.status(500).send({mensaje:'Los datos ya no pueden existir'})
        if(categoriaEncontrada.nombre === 'Default') return res.status(500).send({mensaje:'No hay permiso para eliminar la categoria '})


        //PASAR EL PRODUCTO A UNA CATEGORIA DEFAULT

        Producto.updateMany({categoriaProducto: idCategoria}, {$set:{categoriaProducto: idDefault }},{multi:true}, (err,productoActualizado)=>{
            if(err) return res.status(500).send({mensaje:'Error al Actualizar este producto'})
            if(!productoActualizado) return res.status({mensaje:'No se encuentra los datos'})
            if(productoActualizado) return res.status(200).send({productoActualizado})

        })

        // ELIMINAR LA CATEGORIA
        Categoria.findByIdAndDelete(idCategoria,(err,categoriaEliminada)=>{
            if(err) return res.status(500).send({mensaje:'Error al eliminar esta categoira'})
            if(!categoriaEliminada) return res.status(500).send({mensaje:'Los datos ya no existen'})

            if(categoriaEliminada) return res.status(200).send({mensaje:'La categoria se ha eliminado'})
        })
    })
    
}

function bucarCategories(req,res) {

    var idCategoria;
    var params = req.body
    if(req.user.rol != 'ROL_CLIENTE'){
        return res.status(500).send({mensaje:'No posee el permiso de buscar los productos por categoria'})
    }

    if(!params.nombre) return res.status(500).send({mensaje:'Agrege los parametros necesarios'})

    Categoria.findOne({nombre:params.nombre}).exec((err,categoriaEncontrada)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!categoriaEncontrada) return res.status(500).send({mensaje:'La categoria que busca no existe'});
        idCategoria = categoriaEncontrada._id

        Producto.find({categoriaProducto: idCategoria}).exec((err,ProductoEncontrado)=>{
            if(err) return res.status(500).send({mensaje:'Error en la peticion'})
            if(!ProductoEncontrado) return res.status(500).send({mensaje:'no hay productos existentes'});
            if(ProductoEncontrado) return res.status(200).send({ProductoEncontrado})
        })
    })
    
}


module.exports = {
    AgregarCategorie,
    mostrarCategories,
    updateCategories,
    deleteCategories,
    bucarCategories
}