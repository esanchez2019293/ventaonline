'use strict'

var express = require("express");
var Productcontroller = require("../controllers/product.controller")

// MIDDLEWARES

var md_autorizacion = require("../middlewares/authenticated");

//RUTAS

var api = express.Router()

api.post('/agregarproduct/:id', md_autorizacion.ensureAuth, Productcontroller.agregarproduct);
api.put('/editproduct/:id', md_autorizacion.ensureAuth, Productcontroller.editproduct);
api.delete('/Deleteproduct/:id', md_autorizacion.ensureAuth, Productcontroller.Deleteproduct);
api.get('/showProducts',md_autorizacion.ensureAuth, Productcontroller.showProducts);
api.get('/Producto', Productcontroller.Nameproducto);
api.get('/Productoagotado',md_autorizacion.ensureAuth, Productcontroller.Productoagotado);
api.get('/ProductoMasVendido', Productcontroller.ProductoMasVendido);

module.exports = api