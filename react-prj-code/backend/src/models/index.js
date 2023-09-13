"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = require(__dirname + "/../config/db")[env];
const db = {};

let sequelize;

//if (process.env.NODE_ENV == "development") {
sequelize = new Sequelize(
  //dbConfig.database,
  //dbConfig.username,
  //dbConfig.password,
  dbConfig
);
// } else {
//   sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASS,
//     {
//       dialect: "mysql",
//       pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
//       dialectOptions: { socketPath: process.env.DB_CONNECTION_NAME },
//     }
//   );
// }

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
