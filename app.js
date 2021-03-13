'use strict'

//VARIABLES GLOBALES

const express = require("express");
const app = express();
const bodyParser = require("body-parser");


//IMPORTACION DE RUTAS
var categorie_routes = require("./src/routes/categorie.routes");
var product_routes = require("./src/routes/product.routes");
//var factura_routes = require("./src/routes/factura.routes");
var usuario_routes = require("./src/routes/usuario.routes");
// MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//APLICACIONES DE LA RUTA
app.use('/api', usuario_routes, categorie_routes, product_routes);

//EXPORTACIONES 
module.exports = app