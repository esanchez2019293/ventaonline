const mongoose = require("mongoose");
const app = require("./app");
var controladorAdmin = require("./src/controllers/usuario.controller")

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', {useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{

    console.log('Se encuentra conectado a la base de datos');

    controladorAdmin.admin();

    app.listen(3000,function(){

        console.log('Servidor trabajando con el puerto 3000')
    })    

}).catch(err => console.log(err));