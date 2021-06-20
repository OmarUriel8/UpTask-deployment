const { Sequelize } = require('sequelize');
// extraer valores de variables.env
require('dotenv').config({ path: 'variables.env' });

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
	host: process.env.BD_HOST,
	dialect: 'mysql', //| 'mariadb' | 'postgres' | 'mssql'
	port: process.env.BD_PORT,
	//operatorsAliases: false,
	define: {
		timestamps: false,
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
});

module.exports = db;
/**
si no aparece unknow database 'uptasknoede' usar el siguiente comando en la terminal de mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345678pq';
FLUSH PRIV
 */
