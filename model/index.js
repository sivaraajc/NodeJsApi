// DB_Config/sequelize.js
const mysql = require('../DB_Config/MysqlDB');
const { Sequelize, DataTypes } = require('sequelize');
const mysql2 = require('mysql2/promise'); // Import mysql2 to use promises

const { DB, USER, PASSWORD, HOST, dialect } = mysql;

async function initializeDatabase() {
    const connection = await mysql2.createConnection({ host: HOST, user: USER, password: PASSWORD });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB} ;`);
    await connection.end();
}

const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: dialect,
});

sequelize.authenticate()
    .then(() => {
        console.log("DB Connected Successfully");
    })
    .catch(err => {
        console.log("Error While Connecting DB:", err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.adminDepartmentMaster = require('../model/Admin/DepartmentMaster')(sequelize, DataTypes);
db.adminEmployeeMaster = require('../model/Admin/EmployeeMaster')(sequelize, DataTypes);

db.adminLogins=require('../model/Admin/adminLogins')(sequelize, DataTypes);

db.visitor =require('../model/Security/visitor')(sequelize, DataTypes);


(async () => {
    await initializeDatabase();
    await sequelize.sync({ force: false });
    console.log("Database & tables created!");
})();

module.exports = db;
