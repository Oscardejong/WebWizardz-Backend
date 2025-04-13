"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
class Account {
    getAccountType() {
        return this.accountType;
    }
    getPassword() {
        return this.password;
    }
    getUserName() {
        return this.username;
    }
    getPayments() {
        return this.payments;
    }
    getDomains() {
        return this.domains;
    }
    constructor(username, password, accountType, creationDate = new Date()) {
        this.username = username;
        this.password = password;
        this.accountType = accountType;
        this.creationDate = creationDate;
        this.payments = [];
        this.domains = [];
    }
    verifyPassword(oldPassword) {
        return this.password === oldPassword;
    }
    // Login-methode
    login() {
        if (this.username && this.password) {
            return new Result_1.default(true, 'Login successful');
        }
        else {
            return new Result_1.default(false, 'Login failed');
        }
    }
    tryAddPayment() {
        return new Result_1.default(true, 'Payment added successfully');
    }
    tryAddDomain() {
        return new Result_1.default(true, 'Domain added successfully');
    }
    changePassword(oldPassword, newPassword, checkPassword) {
        const validationResult = checkPassword(oldPassword, newPassword, this);
        if (!validationResult.success) {
            return validationResult;
        }
        this.password = newPassword;
        return new Result_1.default(true, 'Password changed successfully');
    }
}
exports.default = Account;
