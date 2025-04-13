"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
class CheckDomainName {
    checkDomain(domain) {
        return new Result_1.default(true, `Domain name ${domain.getDomainName} is valid`);
    }
}
exports.default = CheckDomainName;
