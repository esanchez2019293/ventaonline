'use strict'

var express = require('express');
var categoriecontroller = require('../controllers/categorie.controller');

//IMPORTACION DE MIDDLEWARE
 
var md_autorizacion = require("../middlewares/authenticated")

//RUTAS

var api = express.Router()
api.post('/AgregarCategorie', md_autorizacion.ensureAuth, categoriecontroller.AgregarCategorie);
api.get('/mostrarCategories', categoriecontroller.mostrarCategories);
api.put('/updateCategories/:id', md_autorizacion.ensureAuth, categoriecontroller.updateCategories);
api.delete('/deleteCategories/:id',md_autorizacion.ensureAuth, categoriecontroller.deleteCategories);
api.get('/ProductoPorCategoria',md_autorizacion.ensureAuth, categoriecontroller.bucarCategories);

module.exports = api
