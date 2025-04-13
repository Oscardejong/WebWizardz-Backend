class AgeCalculator {
    private birthdate: Date;

    constructor(birthdate: Date | string) {
        this.birthdate = new Date(birthdate);
    }

    getAge(): number {
        const currentDate = new Date();
        let age = currentDate.getFullYear() - this.birthdate.getFullYear();
        const monthDiff = currentDate.getMonth() - this.birthdate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < this.birthdate.getDate())) {
            age--;
        }

        return age;
    }
}

export default AgeCalculator;
