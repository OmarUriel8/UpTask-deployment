const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
	//res.send('Index'); //existe json y render(html)
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });

	res.render('index', {
		nombrePagina: 'Proyectos',
		proyectos,
	});
};

exports.formularioProyectos = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	res.render('nuevoProyecto', {
		nombrePagina: 'Nuevo Proyecto',
		proyectos,
	});
};
exports.nuevoProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	// res.send('Enviaste el formulario');
	//enviar a la consola lo que el usuario escriba
	// console.log(req.body);

	//validar que tengamos algo en el input
	const { nombre } = req.body;
	let errores = [];
	if (!nombre) {
		errores.push({ texto: 'Agrega un nombre al proyecto' });
	}

	//si hay errores
	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos,
		});
	} else {
		//si no hay errores
		//insertar en la base de datos
		/*Proyectos.create({
			nombre,
		})
			.then(() => console.log('Insertado correctamente'))
			.catch((error) => console.log(error));
			*/
		const usuarioId = res.locals.usuario.id;
		const proyecto = await Proyectos.create({ nombre, usuarioId });
		res.redirect('/');
	}
};

exports.proyectoPorUrl = async (req, res, next) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	//res.send(req.params.url);
	const proyecto = await Proyectos.findOne({
		where: {
			url: req.params.url,
			usuarioId,
		},
	});
	// consultar tareas del proyecto actual
	const tareas = await Tareas.findAll({
		where: {
			proyectoId: proyecto.id,
		},
		//include: [ { model: Proyectos } ], // parecido al join en sql
	});

	if (!proyecto) return next();

	// console.log(proyecto);
	// res.send('OK');
	res.render('tareas', {
		nombrePagina: 'Tareas del Proyecto',
		proyecto,
		proyectos,
		tareas,
	});
};

exports.formularioEditar = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });

	const proyecto = await Proyectos.findOne({
		where: {
			id: req.params.id,
			usuarioId,
		},
	});

	//const { proyectos, proyecto } = await Promise.all([ proyectosPromise, proyectoPromise ]); no fucniono marca error
	//render a la vista
	res.render('nuevoProyecto', {
		nombrePagina: 'Editar Proyecto',
		proyectos,
		proyecto,
	});
};

exports.actualizarProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	//validar que tengamos algo en el input
	const { nombre } = req.body;
	let errores = [];
	if (!nombre) {
		errores.push({ texto: 'Agrega un nombre al proyecto' });
	}

	//si hay errores
	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos,
		});
	} else {
		//si no hay errores
		//Actualizamos en la base de datos
		await Proyectos.update({ nombre }, { where: { id: req.params.id } });
		res.redirect('/');
	}
};

exports.eliminarProyecto = async (req, res, next) => {
	// console.log(req);
	//console.log(req.params); //lo que se usa en el servidor url(esto fue definido en las rutas)
	//console.log(req.query); //lo que se envia del cliente en este caso se uso urlProyecto
	const { urlProyecto } = req.query;

	const resultado = await Proyectos.destroy({
		where: {
			url: urlProyecto,
		},
	});
	if (!resultado) {
		return next();
	}

	res.status(200).send('Proyecto eliminado correctamente');
};
