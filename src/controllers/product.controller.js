'use strict'

const { find } = require("../models/product.model");
var Producto = require("../models/product.model");
function agregarproduct(req, res) {
    var productoModel = new Producto()
    var params = req.body;
    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No hay permisos para agregar uno otro producto' })
    }
    delete params.ventas;
    if (params.nombre && params.stock) {

        productoModel.nombre = params.nombre
        productoModel.stock = params.stock
        productoModel.ventas = 0
        productoModel.categoriaProducto = req.params.id;
        Producto.find({ nombre: params.nombre }).exec((err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (productoEncontrado && productoEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: 'Este producto ya existe' })
            } else {
                productoModel.save((err, productoGuardado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error al almacenar este  Producto' })
                    if (productoGuardado) {
                        return res.status(200).send({ productoGuardado })
                    } else {
                        return res.status(500).send({ mensaje: 'Error al almacernar este Producto' })
                    }

                })
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'Es necesario ingresar todo los parametros' })

    }
}

function editproduct(req, res) {
    var idProducto = req.params.id;
    var params = req.body

    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No hay permisos para editar un producto' })

    }

    delete params.ventas
    delete params.categoriaProducto

    Producto.find({ nombre: params.nombre }).exec((err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })

        if (productoEncontrado && productoEncontrado.length >= 1) {
            return res.status(500).send({ mensaje: 'El al que desea actualizar este y existe ' })

        } else {
            Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, productoActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error al actualizar este Producto' })
                if (!productoActualizado) return res.status({ mensaje: 'No se pueden encotrar estos datos' })
                if (productoActualizado) return res.status(200).send({ productoActualizado })

            })

        }

    })


}

function Deleteproduct(req, res) {
    var idProducto = req.params.id;
    var params = req.body;
    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No hay permisos para cortar este producto' })
    }
    Producto.findByIdAndDelete(idProducto, (err, productoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!productoEliminado) return res.status(500).send({ mensaje: 'No hay datos' })
        if (productoEliminado) return res.status(200).send({ mensaje: 'Este producto ya esta  Eliminado' })
    })

}

function showProducts(req, res) {
    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No posee permiso para ver los productos' })
    }
    Producto.find().exec((err, productosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!productosEncontrados) return res.status(500).send({ mensaje: 'Todavia no hay productos' });
        if (productosEncontrados) return res.status(200).send({ productosEncontrados })
    })
}

function Nameproducto(req, res) {
    var params = req.body
    if (params.nombre) {
        Producto.findOne({ nombre: params.nombre }).exec((err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!productoEncontrado) return res.status(500).send({ mensaje: 'El Producto que deseamos buscar no existe' })
            if (productoEncontrado) return res.status(200).send({ productoEncontrado })
        })
    } else {
        return res.status(500).send({ mensaje: 'Es necesario llenar todos los parametros' })
    }
}

function Productoagotado(req, res) {
    var stock2 = 0
    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'No hay  permisos para ver todos los productos agotados' })
    }
    Producto.find({ stock: stock2 }).exec((err, productoAgotado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!productoAgotado) return res.status(500).send({ mensaje: 'No hay productos agotados' })
        if (productoAgotado) return res.status(200).send({ productoAgotado })
    })

}

function ProductoMasVendido(req, res) {
    Producto.find({
        ventas: { $gt: 4 }
    }, {
        _id: 0, stock: 0, categoriaProducto: 0, __v: 0
    }).sort({ ventas: -1 }).limit(5).exec((err, productosMasVendidos) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productosMasVendidos) return res.status(500).send({ mensaje: 'No hay productos como una venta mayor a 6' })
        if (productosMasVendidos) return res.status(200).send({ productosMasVendidos })
    })
}
module.exports = {

    agregarproduct,
    editproduct,
    Deleteproduct,
    showProducts,
    Nameproducto,
    Productoagotado,
    ProductoMasVendido

}