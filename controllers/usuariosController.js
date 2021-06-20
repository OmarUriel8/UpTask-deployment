const Usuarios = require('../models/Usuarios');
const { body } = require('express-validator/check');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
	res.render('crearCuenta', {
		nombrePagina: 'Crear Cuenta en UpTask',
	});
};

exports.formIniciarSesion = (req, res) => {
	const { error } = res.locals.mensajes;
	res.render('iniciarSesion', {
		nombrePagina: 'Iniciar Sesión en UpTask',
		error,
	});
};

exports.crearCuenta = async (req, res, next) => {
	// Leer los datos
	const { email, password } = req.body;
	try {
		// Crear usuario
		await Usuarios.create({ email, password });

		// Crear URL de confirmar
		const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
		// crear el objeto de usuario
		const usuario = {
			email,
		};
		// enviar email
		await enviarEmail.enviar({
			usuario,
			subject: 'Confirma tu cuenta UpTask',
			confirmarUrl,
			archivo: 'confirmar-cuenta',
		});
		// redirigir al usuario
		req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
		res.redirect('/iniciar-sesion');
	} catch (error) {
		req.flash('error', error.errors.map((error) => error.message));
		//console.log(error);
		//console.log(req.flash());
		res.render('crearCuenta', {
			nombrePagina: 'Crear Cuenta en UpTask',
			mensajes: req.flash(),
			email,
			password,
			//errores: error.errors, //[ 'Usuario Ya Registrado' ],
		});
	}
};

exports.formreestablecerPassword = (req, res) => {
	res.render('reestablecer', {
		nombrePagina: 'Reestablecer tu contraseña',
	});
};

exports.confirmarCuenta = async (req, res) => {
	const usuario = await Usuarios.findOne({ where: { email: req.params.correo } });

	// si no existe el usuario
	if (!usuario) {
		req.flash('error', 'EL correo no es valido');
		res.redirect('/crear-cuenta');
	}
	usuario.activo = 1;
	await usuario.save();
	req.flash('correcto', 'Cuenta activada correctamente');
	res.redirect('/iniciar-sesion');
};
