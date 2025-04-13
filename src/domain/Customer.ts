import AgeCalculator from './AgeCalculator';
import Gender from './Gender';
import Account from './Account';

class Customer {
    private firstName: string;
    private lastName: string;
    private email: string;
    private gender: Gender;
    private birthdate: Date;

    constructor(firstName: string, lastName: string, email: string, birthdate: Date, gender: Gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.birthdate = birthdate;
    }

    getFirstName(): string {
        return this.firstName;
    }
    getLastName(): string {
        return this.lastName;
    }
    getEmail(): string {
        return this.email;
    }
    getBirthdate(): Date {
        return this.birthdate;
    }
    getGender(): Gender{
        return this.gender;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    getAge(): number {
        const ageCalculator = new AgeCalculator(this.birthdate);
        return ageCalculator.getAge();
    }

    getCustomerInfo(): string {
        return `Customer: ${this.getFullName()}, Email: ${this.email}, Age: ${this.getAge()}, Gender: ${this.gender}`;
    }
}

export default Customer;
