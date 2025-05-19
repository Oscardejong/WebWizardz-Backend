import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";
import Customer from "./Model-Customer";


interface AccountAttributes {
    AccountID: number;
    username: string;
    password: string;
    CustomerID: number;
    accounttype: string;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, "AccountID"> {}

class AccountModel extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
    public AccountID!: number;
    public username!: string;
    public password!: string;
    public CustomerID!: number;
    public accounttype!: string;
}

AccountModel.init(
    {
        AccountID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustomerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Customer,
                key: "CustomerID",
            },
            onDelete: 'CASCADE',
        },
        accounttype: {
            type: DataTypes.STRING,  
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Account",
        timestamps: false,
    }
);



// 👇 DEBUG: check of DomainModel geldig is

// Associaties met Customer
AccountModel.belongsTo(Customer, { foreignKey: "CustomerID" });
Customer.hasOne(AccountModel, { foreignKey: "CustomerID" });


export default AccountModel;
