'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorieSchema = Schema({
    nombre: String

})

module.exports = mongoose.model('categorias',CategorieSchema);