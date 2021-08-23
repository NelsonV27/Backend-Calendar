/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

//debemos crear una constante para exportar
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

//exportamos el archivo middlewares - validar campos
const { validarCampos } = require('../middlewares/validar-campos');

//exportamos para validar el token
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new', 
    [
        //middlewares crearUsuario
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6}),
        validarCampos
    ] ,
    crearUsuario
);

router.post(
    '/', 
    [
        //mindlewares loginUsuario
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6}),
        validarCampos
    ], 
    loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
