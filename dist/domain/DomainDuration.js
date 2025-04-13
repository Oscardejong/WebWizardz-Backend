"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainDuration {
    constructor(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
    getDurationInHours() {
        if (this.endTime < this.startTime) {
            throw new Error("End time cannot be earlier than start time.");
        }
        const diff = this.endTime.getTime() - this.startTime.getTime();
        return diff / (1000 * 60 * 60);
    }
}
exports.default = DomainDuration;
