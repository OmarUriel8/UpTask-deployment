//import express from 'express';//no se usa en express
const express = require('express'); //es lo mismo que la linea 1
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
//crear la conexion a la base de datos
const expressValidator = require('express-validator');
const db = require('./config/db');
//flash para mostrar mensjes en este caso para validar formularios
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//Helpers con algunas funciones
const helpers = require('./helpers');
//Immportar el modelo
require('./models/Proyectos'); //ya debe de estar creada la base de datos manualmente
//db.sync hara que se sincronicen las configuraciones de las tablas que se usaran pero la base de datos ya debe de estar creada
require('./models/Tareas');
require('./models/Usuarios');
// importar las variables
require('dotenv').config({ path: 'variables.env' });
db
	.sync()
	.then(() => {
		console.log('Conectado al Servidor');
	})
	.catch((error) => {
		console.log(error);
	});
//creando app de express
const app = express();

//dode cargar los archivos estaticos
app.use(express.static('public'));
//habilitar pug
app.set('view engine', 'pug');
//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Agregamos express validator a toda la aplicación
app.use(expressValidator());
//anadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

app.use(cookieParser());
// sessiones nos permiten necegar entre dstintas paginas sin
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
// agregar flash messages
app.use(flash());
//pasar vardump a la aplicacion
app.use((req, res, next) => {
	res.locals.vardump = helpers.vardump;
	res.locals.mensajes = req.flash();
	res.locals.usuario = { ...req.user } || null;
	next();
});

app.use('/', routes());

// sevidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
	console.log('El servidor esta funcionando');
}); //puerto

//require('./handlers/email');
