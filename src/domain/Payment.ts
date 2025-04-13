import Paymentstatus from './Paymentstatus';


class Payment {
    private paymentMethod: string;
    private paymentTime: Date; 
    private paymentAmount: number;
    private paymentStatus: Paymentstatus;

    constructor(
        paymentMethod: string,
        paymentTime: Date,
        paymentAmount: number,
        paymentStatus: Paymentstatus
    ) {
        this.paymentMethod = paymentMethod;
        this.paymentTime = paymentTime;
        this.paymentAmount = paymentAmount;
        this.paymentStatus = paymentStatus;
    }

    public getPaymentDetails(): string {
        return `Method: ${this.paymentMethod}, Date & Time: ${this.paymentTime}, Amount: $${this.paymentAmount.toFixed(2)}, Status: ${this.paymentStatus}`;
    }

    public updatePaymentStatus(status: Paymentstatus): void {
        this.paymentStatus = status;
    }
}

export default Payment;