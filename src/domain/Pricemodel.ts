

class PriceModel {
    private pricePerHour: number;
    private startDate: Date;
    private endDate: Date;

    constructor(pricePerHour: number, startDate: Date, endDate: Date) {
        this.pricePerHour = pricePerHour;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public getPrice(): number {
        return this.pricePerHour;
    }

    public isValid(): boolean {
        const currentDate = new Date();
        return currentDate >= this.startDate && currentDate <= this.endDate;
    }
}

export default PriceModel;