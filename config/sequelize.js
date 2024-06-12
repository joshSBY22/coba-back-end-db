const Sequelize = require("sequelize");
require('dotenv').config()

const db = new Sequelize(
    process.env.DATABASE_NAME, //database name
    process.env.DATABASE_USERNAME, //database username
    process.env.DATABASE_PASSWORD, //database password
    {
        host: process.env.DATABASE_HOST_URL, //database host
        port: 3306, //default MySQL port
        dialect: "mysql",
        logging: true,
        timezone: "+07:00"
    }
);

module.exports = db;
