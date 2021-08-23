const { Schema, model } = require('mongoose');

//creamos la funcion de UsuarioSchema
const UsuarioSchema = Schema({

    name:{
        type:String,
        required:true
    },

    //email
    email:{
        type:String,
        required:true,
        unique:true
    },

    //password
    password:{
        type:String,
        required:true
    }
});

//exportamos la funcion UsuarioSchema
module.exports = model('Usuario', UsuarioSchema );