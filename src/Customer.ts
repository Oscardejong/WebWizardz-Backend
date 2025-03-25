import AgeCalculator from './AgeCalculator';
import Gender from './Gender';
import Account from './Account';

class Customer {
    private firstName: string;
    private lastName: string;
    private email: string;
    private gender: Gender;
    private account: Account;
    private ageCalculator: AgeCalculator;

    constructor(firstName: string, lastName: string, email: string, birthdate: Date, gender: Gender, account: Account) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.account = account;
        this.ageCalculator = new AgeCalculator(birthdate);
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    getAge(): number {
        return this.ageCalculator.getAge();
    }

    // Nieuwe methode die de accountinformatie van de klant retourneert
    getAccountInfo(): string {
        return `Account Info: Username: ${this.account.getUserName()}, Account Type: ${this.account.getAccountType()}`;
    }

    getCustomerInfo(): string {
        return `Customer: ${this.getFullName()}, Email: ${this.email}, Age: ${this.getAge()}, Gender: ${this.gender}`;
    }
}

export default Customer;
