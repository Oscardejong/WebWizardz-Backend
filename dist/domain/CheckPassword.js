"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
function CheckPassword(oldPassword, newPassword, account) {
    if (oldPassword !== account.getPassword()) {
        return new Result_1.default(false, "Oude wachtwoord is incorrect.");
    }
    if (newPassword === oldPassword) {
        return new Result_1.default(false, "Nieuwe wachtwoord mag niet hetzelfde zijn als het oude.");
    }
    return new Result_1.default(true, "Wachtwoorden komen overeen.");
}
exports.default = CheckPassword;
