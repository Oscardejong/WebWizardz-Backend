import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database"; 
import Account from "./Model-Account"; 

interface CustomerAttributes {
    CustomerID: number;
    firstname: string;
    lastname: string;
    email: string;
    birthdate: Date;
    gender: string;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, "CustomerID"> {}

class CustomerModel extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    public CustomerID!: number;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public birthdate!: Date;
    public gender!: string;
}

CustomerModel.init(
    {
        CustomerID: {  
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'CustomerID', 
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM("M", "F"),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Customer",  
        timestamps: false, 
    }
);

export default CustomerModel;
