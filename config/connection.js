/**
 * Sequelize Connection Config
 */
require('dotenv').config();

const Sequelize = require('sequelize');

let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // needed to change syntax from DBA_NAME, DB_USER to DBANAME, DBUSER as the underscores were preventing the database from running.
    sequelize = new Sequelize('C_M_A', 'root', process.env.DB_PW, {
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;