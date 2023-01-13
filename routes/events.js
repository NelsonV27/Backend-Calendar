
//importar router
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

//validar fecha
const { isDate } = require('../helpers/isDate');

//importamos el archivo para validar campos
const { validarCampos } = require('../middlewares/validar-campos');

//Todas tienen que pasa por la validacion del JWT
const { validarJWT } = require('../middlewares/validar-jwt');
router.use( validarJWT );

//importar las funciones de los eventos
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
//Obtener eventos
router.get('/', getEventos);

//Crear un nuevo evento
router.post(
    '/',
    [
        //crear el middlewares del evento para validar el event
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ], 
    crearEvento
);

//Actualizar Evento
router.put('/:id', actualizarEvento);

//Borrar evento
router.delete('/:id', eliminarEvento);

//exportamos el router
module.exports = router;