const { Schema, model } = require('mongoose');

//creamos la funcion de UsuarioSchema
const EventoSchema = Schema({

    title: {
        type:String,
        required:true
    },
    notes: {
        type:String
    },
    start: {
        type:Date,
        required:true
    },
    end: {
        type:Date,
        required:true
    },
    //user
    user:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    }
    
});

//Adicional
EventoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object; 
})

//exportamos la funcion UsuarioSchema
module.exports = model('Evento', EventoSchema );