"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Payment {
    constructor(paymentMethod, paymentTime, paymentAmount, paymentStatus) {
        this.paymentMethod = paymentMethod;
        this.paymentTime = paymentTime;
        this.paymentAmount = paymentAmount;
        this.paymentStatus = paymentStatus;
    }
    getPaymentDetails() {
        return `Method: ${this.paymentMethod}, Date & Time: ${this.paymentTime}, Amount: $${this.paymentAmount.toFixed(2)}, Status: ${this.paymentStatus}`;
    }
    updatePaymentStatus(status) {
        this.paymentStatus = status;
    }
}
exports.default = Payment;
