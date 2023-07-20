/**
 * Sequelize Connection Config
 */
require('dotenv').config();

const Sequelize = require('sequelize');

let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPW, {
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;