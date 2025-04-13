"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
class Domain {
    getDomainName() {
        return this.domainName;
    }
    constructor(domainName, Domainstatus, domainDuration, pricemodel) {
        this.domainName = domainName;
        this.Domainstatus = Domainstatus;
        this.domainDuration = domainDuration;
        this.pricemodels = [];
        this.websites = [];
    }
    changeStatus(newStatus) {
        this.Domainstatus = newStatus;
        return new Result_1.default(true, 'Domain status updated successfully');
    }
}
exports.default = Domain;
