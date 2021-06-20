const express = require('express');
const router = express.Router();
// importar express validator
const { body } = require('express-validator/check');
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
	router.get('/', authController.usuarioAutentificado, proyectosController.proyectosHome);
	router.get('/nuevo-proyecto', authController.usuarioAutentificado, proyectosController.formularioProyectos);
	router.post(
		'/nuevo-proyecto',
		authController.usuarioAutentificado,
		body('nombre').not().isEmpty().trim().escape(),
		proyectosController.nuevoProyecto
	);

	//listar proyecto
	router.get('/proyectos/:url', authController.usuarioAutentificado, proyectosController.proyectoPorUrl);

	//Actualizar el proyecto
	router.get('/proyecto/editar/:id', authController.usuarioAutentificado, proyectosController.formularioEditar);
	//editar proyecto
	router.post(
		'/nuevo-proyecto/:id',
		authController.usuarioAutentificado,
		body('nombre').not().isEmpty().trim().escape(),
		proyectosController.actualizarProyecto
	);
	//Eliminar proyecto
	router.delete('/proyectos/:url', authController.usuarioAutentificado, proyectosController.eliminarProyecto);

	//Tareas
	router.post('/proyectos/:url', authController.usuarioAutentificado, tareasController.agregarTarea);

	// Actualizar tarea, patch solo cambia una parte del registro
	router.patch('/tareas/:id', authController.usuarioAutentificado, tareasController.cambiarEstadoTarea);
	// Eliminar tarea
	router.delete('/tareas/:id', authController.usuarioAutentificado, tareasController.eliminarTarea);

	// Crear nueva cuenta
	router.get('/crear-cuenta', usuariosController.formCrearCuenta);
	router.post('/crear-cuenta', usuariosController.crearCuenta);
	router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
	// iniciar sesion
	router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.autentificarUsuario);
	// router.get('/iniciar-sesion', usuariosController.);

	//cerrar sesion
	router.get('/cerrar-sesion', authController.cerrarSesion);
	// reestablecer contraseña
	router.get('/reestablecer', usuariosController.formreestablecerPassword);
	router.post('/reestablecer', authController.enviarToken);
	router.get('/reestablecer/:token', authController.validarToken);
	router.post('/reestablecer/:token', authController.actualizarPassword);
	return router;
};

/*
// que se va a var cuando entras a home localhost:3000
//use sirve para que lea cualquier request o verbo de html
app.use('/', (req, res) => {
	res.send('Hola'); //existe json y render(html)
});

 */
