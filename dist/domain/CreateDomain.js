"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Domain_1 = __importDefault(require("./Domain"));
const Result_1 = __importDefault(require("./Result"));
class CreateDomain {
    // private checkDomains: ICheckDomain[]; 
    constructor(domainName, Domainstatus, domainDuration, pricemodel) {
        // this.checkDomains = checkDomains; 
    }
    createDomain(domainName, DomainStatus, domainDuration, priceModel) {
        const domain = new Domain_1.default(domainName, DomainStatus, domainDuration, priceModel);
        return new Result_1.default(true, `Domain ${domain.getDomainName()} is created`);
    }
}
