const jwt = require('jsonwebtoken');

//funcion GenerarJWT
const generarJWT = ( uid, name ) => {

    //retornaremos una promesa
    return new Promise((resolve, reject ) => {

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_JWT_SEED , {
            expiresIn:'2h'
        }, ( err, token ) => {
            

            //validacion para ver si hay un error
            if( err ){
                console.log( err );
                reject( 'No se pudo generar el token' );
            }

            resolve( token );
        })

    })

}

module.exports = {
    generarJWT
}