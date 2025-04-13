"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Result_1 = __importDefault(require("./Result"));
class Website {
    constructor(url, hosting) {
        this.url = url;
        this.hosting = hosting;
    }
    changeHosting(newHosting) {
        this.hosting = newHosting;
        return new Result_1.default(true, 'Hosting changed successfully');
    }
}
exports.default = Website;
