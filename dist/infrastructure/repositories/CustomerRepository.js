"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = __importDefault(require("../models/Customer"));
class CustomerRepository {
    insertCustomer(customerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield Customer_1.default.create(customerData);
                console.log("Customer inserted:", customer.toJSON());
                return customer;
            }
            catch (error) {
                console.error("Error inserting customer:", error);
                throw error;
            }
        });
    }
}
exports.default = new CustomerRepository();
