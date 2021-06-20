const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('Sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// autentificar el usuario
exports.autentificarUsuario = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true,
	badRequestMessage: 'Ambos campos son obligatorios',
});

//Funcion para revisar si el usuario esta loogeado o no
exports.usuarioAutentificado = (req, res, next) => {
	// si el usuario esta autenticado, adelante
	if (req.isAuthenticated()) {
		return next();
	}
	// sino esta autenticado, redirigir al formulario
	return res.redirect('/iniciar-sesion');
};

// Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/iniciar-sesion');
	});
};

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
	// verifica que le usuario existe
	const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

	// si no hay usuario
	if (!usuario) {
		req.flash('error', 'No existe esa cuenta');
		res.redirect('/reestablecer');
		/*res.render('reestablecer', {
			nombrePagina: 'reestablecer tu contraseña',
			mensajes: req.flash(),
		});*/
	}
	// El usuario existe
	usuario.token = crypto.randomBytes(20).toString('hex');
	usuario.expiracion = Date.now() + 3600000;

	// guardarlos en la base de datos
	await usuario.save();

	//url de reset
	const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
	//console.log(resetUrl);
	// envia el correo con el token
	await enviarEmail.enviar({
		usuario,
		subject: 'Password reset',
		resetUrl,
		archivo: 'reestablecer-password',
	});

	// terminar
	res.flash('correcto', 'Se envio un mensaje a tu correo');
	res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
	console.log(req.params.token);
	const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
	// si no encuentra el usuario
	if (!usuario) {
		req.flash('error', 'No Válido');
		res.redirect('/reestablecer');
	}
	// formulario para reestablecer contraseña
	res.render('resetPassword', {
		nombrePagina: 'reestablecer contraseña',
	});
};

exports.actualizarPassword = async (req, res) => {
	console.log(req.params.token);
	// verifica el token valido y la fecha de expiracion
	const usuario = await Usuarios.findOne({
		where: {
			token: req.params.token,
			expiracion: {
				[Op.gte]: Date.now(),
			},
		},
	});

	//verificamos si el usuario existe
	if (!usuario) {
		res.flash('error', 'No Válido');
		res.redirect('/reestablecer');
	}
	//hashea el nuevo password
	usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	usuario.token = null;
	usuario.expiracion = null;

	// guardamos el nuevo password
	await usuario.save();
	req.flash('correcto', 'Tu password se ha modificado correctamente');
	res.redirect('/iniciar-sesion');
};
