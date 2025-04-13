"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // 🔹 Database-connectie importeren
class Customer extends sequelize_1.Model {
}
// ORM-configuratie koppelen aan de database
Customer.init({
    CustomerID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    birthdate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.CHAR(1), // Gebruik CHAR(1) voor gender
        allowNull: false,
        validate: {
            isIn: [['M', 'F']], // Alleen 'M' of 'F' zijn toegestaan
        },
    },
}, {
    sequelize: database_1.default,
    tableName: "Customer",
    timestamps: false, // Geen createdAt en updatedAt kolommen
});
exports.default = Customer;
