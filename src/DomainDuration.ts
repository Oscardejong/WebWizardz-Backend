class DomainDuration {

    private startTime: Date;
    private endTime: Date;

    constructor( startTime: Date, endTime: Date) {

        this.startTime = startTime;
        this.endTime = endTime;
    }

    getDurationInHours(): number {
        if (this.endTime < this.startTime) {
            throw new Error("End time cannot be earlier than start time.");
        }
        const diff = this.endTime.getTime() - this.startTime.getTime();
        return diff / (1000 * 60 * 60);
    }
}

export default DomainDuration;