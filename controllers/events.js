const { response } = require('express');
const Evento = require('../models/Evento');

//crear la funcion de getEventos
const getEventos = async( req, res = response ) => {

    //creamos una constante para obtener todos los eventos
    const eventos = await Evento.find()
                                .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

//crear la funcion de crearEventos
const crearEvento = async( req, res = response ) => {

    //guardar los datos a la base de datos
    const evento = new Evento( req.body );

    //creamos el trycatch
    try {

        //necesitamos enviar el id del usuario
        evento.user = req.uid; 

        //grabar los datos en la BD
        const eventoGuardado = await evento.save();
        res.json({
            ok: true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

//crear la funcion actualizarEventos
const actualizarEvento = async( req, res = response ) => {

    //creamos una constante para alamcenar el id
    const eventoId = req.params.id;

    //creamos un trycatch
    try {

        //crear una validacion de si existe el usuario en la BD de mongoose
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;

        //preguntamos si existe el evento
        if( !evento ){
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe con ese id'
            })
        }

        //validacion de que si el usuario es igual al id
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento'
            });
        }

        //si la persona es lo dejo pasar y edita el evento
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        //Ahora es momento de actualizar el dato
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        res.json({
            ok: true,
            evento: eventoActualizado,
        })
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
    }

}

//crear la funcion eliminarEvento
const eliminarEvento = async( req, res = response ) => {

    //creamos una constante para almacenar mediante el id de eliminacion del evento
    const eventoId = req.params.id;

    //creamos un trycatch
    try {

        //crear una validacion de si existe el id de ese usuario
        const evento = await Evento.findById( eventoId );
        const uid = req.uid;

        //preguntamos si existe el evento
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            })
        }

        //validacion dle usuario si es igual al id de la BD
        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este evento'
            })
        }

        //Ahora es el momento de eliminar el evento de la BD
        await Evento.findByIdAndDelete( eventoId );
        res.json({
            ok: true
        })
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
    }

}


//exportamos los modulos de cada funcion
module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}
