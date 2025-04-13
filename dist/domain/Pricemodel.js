"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriceModel {
    constructor(pricePerHour, startDate, endDate) {
        this.pricePerHour = pricePerHour;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    getPrice() {
        return this.pricePerHour;
    }
    isValid() {
        const currentDate = new Date();
        return currentDate >= this.startDate && currentDate <= this.endDate;
    }
}
exports.default = PriceModel;
