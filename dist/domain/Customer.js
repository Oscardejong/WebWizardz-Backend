"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AgeCalculator_1 = __importDefault(require("./AgeCalculator"));
class Customer {
    constructor(firstName, lastName, email, birthdate, gender, account) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.account = account;
        this.ageCalculator = new AgeCalculator_1.default(birthdate);
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    getAge() {
        return this.ageCalculator.getAge();
    }
    // Nieuwe methode die de accountinformatie van de klant retourneert
    getAccountInfo() {
        return `Account Info: Username: ${this.account.getUserName()}, Account Type: ${this.account.getAccountType()}`;
    }
    getCustomerInfo() {
        return `Customer: ${this.getFullName()}, Email: ${this.email}, Age: ${this.getAge()}, Gender: ${this.gender}`;
    }
}
exports.default = Customer;
