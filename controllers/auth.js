const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

//Funcion para crear Usuario
const crearUsuario = async(req, res = response ) => {

    //peticion con la req
    const { email, password } =  req.body;

    //siempre en bd se trabaja con un trycatch
    try {

        let usuario = await Usuario.findOne({ email });
        
        //validacion
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg:'El usuario ya existe'
            });
        }

        //creamos la instancia del usuario
        usuario = new Usuario( req.body );

        //Encriptar la contraseña de usuarios
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //crearemos el usuario save
        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );
    
        //peticion para res
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token

        });
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        });
    }
    
}

//Funcion para crear el loginUsuario
const loginUsuario = async(req, res = response ) => {

    //constante para destructurar la variable
    const { email, password } = req.body;

    //creamos un trycatch para manejar las excepciones de error
    try {
        
        const usuario = await Usuario.findOne({ email });
        
        //validacion
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg:'El usuario no existe con ese email'
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        //Validamos el password
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg:'Password incorrecto'
            });
        }

        //Generaremos el JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg:'Por favor hable con el administrador'
        });
    }

}

//Funcion para renovar el revalidarToken
const revalidarToken = async(req, res = response ) => {

    const { uid, name } = req;
    

    //generar un nuevo JWT y retornarlo en esta peticion 
    const token = await generarJWT( uid, name );

    //validar el token 
    res.json({
        ok: true,
        uid,
        name,
        token
    })

}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}