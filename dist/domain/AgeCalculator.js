"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AgeCalculator {
    constructor(birthdate) {
        this.birthdate = new Date(birthdate);
    }
    getAge() {
        const currentDate = new Date();
        let age = currentDate.getFullYear() - this.birthdate.getFullYear();
        const monthDiff = currentDate.getMonth() - this.birthdate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < this.birthdate.getDate())) {
            age--;
        }
        return age;
    }
}
exports.default = AgeCalculator;
