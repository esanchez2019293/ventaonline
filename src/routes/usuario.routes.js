'use strict'
const { Router } = require("express");
var express = require("express");
var usuarioController = require("../controllers/usuario.controller");

//MIDDLEWARES

var md_autorizacion = require("../middlewares/authenticated");

//RUTAS 

var api = express.Router();

api.post('/Login', usuarioController.Login);
api.put('/Modificarrol/:id', md_autorizacion.ensureAuth, usuarioController.Modificarrol);
api.put('/editarusuario/:id', md_autorizacion.ensureAuth, usuarioController.editarusuario);
api.delete('/deleteuser/:id', md_autorizacion.ensureAuth, usuarioController.deleteuser);
api.post('/agregarausuario',md_autorizacion.ensureAuth, usuarioController.agregarusuario);

module.exports = api;