import { DataTypes, Model } from "sequelize";
import sequelize from "../database"; // Database connectie importeren
import Paymentstatus from "../../domain/Paymentstatus";

class Payment extends Model {
    public PaymentID!: number;
    public AccountID!: number;
    public paymentmethod!: string;
    public paymentdate: Date;
    public paymentamount: number;
    public paymentstatus: Paymentstatus;
}

// ORM-configuratie koppelen aan de database
Payment.init(
    {
        CustomerID: {  // Dit is de naam van het attribuut in je model
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'CustomerID',  // Specificeer de exacte kolomnaam in de database
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

export default Customer;
