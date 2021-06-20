const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
	//Obtenemos proyecto actual
	const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
	//console.log(proyecto);
	console.log(req.body);
	// Leer el valor del proyecto
	const { tarea } = req.body;
	//Agregar errores
	//******************************************* */
	let errores = [];
	if (!tarea) {
		errores.push({ texto: 'Agrega un nombre al proyecto' });
	}
	const tareas = await Tareas.findAll({
		where: { proyectoId: proyecto.id },
	});
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({ where: { usuarioId } });
	//******************************************* */
	if (errores.length > 0) {
		res.render('tareas', {
			nombrePagina: 'Tareas del Proyecto',
			errores,
			proyecto,
			proyectos,
			tareas,
		});
	} else {
		//estado 0 = incompleto y ID del proyecto
		const estado = 0;
		const proyectoId = proyecto.id;

		// insertar en la BD
		const resultado = await Tareas.create({ tarea, estado, proyectoId });
		if (!resultado) return next();

		//redimensonar
		res.redirect(`/proyectos/${req.params.url}`);
	}
};

exports.cambiarEstadoTarea = async (req, res, next) => {
	//console.log(req.params);
	const { id } = req.params;
	const tarea = await Tareas.findOne({ where: { id } });
	//console.log(tarea);
	//Cambiar estado
	let estado = 0;
	if (tarea.estado === estado) {
		estado = 1;
	}
	tarea.estado = estado;
	//guadar en la base de datos
	const resultado = await tarea.save();

	if (!resultado) return next();

	res.status(200).send('Actualizando');
};

exports.eliminarTarea = async (req, res, next) => {
	//console.log(req.query);
	//console.log(req.params);
	const { id } = req.params;
	//eliminar la tarea
	const resultado = await Tareas.destroy({ where: { id } });
	if (!resultado) return next();

	res.status(200).send('Tarea Eliminada Correctamente');
};
