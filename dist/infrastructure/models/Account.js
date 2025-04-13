"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const Customer_1 = __importDefault(require("./Customer"));
class Account extends sequelize_1.Model {
}
Account.init({
    accountID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer_1.default,
            key: "CustomerID",
        },
        onDelete: 'CASCADE',
    },
    creationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: "Account",
    timestamps: false,
});
Account.belongsTo(Customer_1.default, { foreignKey: "customerID" });
Customer_1.default.hasOne(Account, { foreignKey: "customerID" });
exports.default = Account;
