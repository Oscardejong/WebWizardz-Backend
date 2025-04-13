"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("Webwizardz", "postgres", "Maandag#1", {
    host: "localhost",
    dialect: "postgres",
    logging: console.log,
});
exports.default = sequelize;
