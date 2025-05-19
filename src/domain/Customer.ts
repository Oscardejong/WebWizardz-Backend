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
        // Validating firstName
        if (!firstName.trim()) {
            throw new Error("First name cannot be empty or just whitespace.");
        }
        this.firstName = firstName.trim();

        // Validating lastName
        if (!lastName.trim()) {
            throw new Error("Last name cannot be empty or just whitespace.");
        }
        this.lastName = lastName.trim();

        // Validating email format (simple check for "@" symbol)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }
        this.email = email.trim();

        // Validating birthdate (must be a valid date)
        if (!(birthdate instanceof Date) || isNaN(birthdate.getTime())) {
            throw new Error("Invalid birthdate.");
        }
        this.birthdate = birthdate;

        // Gender validation for enum
        if (!Object.values(Gender).includes(gender)) {
            throw new Error("Invalid gender.");
        }
        this.gender = gender;
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

    getGender(): Gender {
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

    // Method to change first name with validation
    changeFirstName(newFirstName: string): void {
        const trimmedName = newFirstName.trim();
        if (trimmedName.length === 0) {
            throw new Error("First name cannot be empty or just whitespace.");
        }
        this.firstName = trimmedName;
    }

    // Method to change last name with validation
    changeLastName(newLastName: string): void {
        const trimmedName = newLastName.trim();
        if (trimmedName.length === 0) {
            throw new Error("Last name cannot be empty or just whitespace.");
        }
        this.lastName = trimmedName;
    }

    // Method to change email with validation
    changeEmail(newEmail: string): void {
        const trimmedEmail = newEmail.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            throw new Error("Invalid email format.");
        }
        this.email = trimmedEmail;
    }

    // Method to change birthdate with validation
    changeBirthdate(newBirthdate: Date): void {
        if (!(newBirthdate instanceof Date) || isNaN(newBirthdate.getTime())) {
            throw new Error("Invalid birthdate.");
        }
        this.birthdate = newBirthdate;
    }

     // Method to change gender with validation
     changeGender(newGender: Gender): void {
        // Check if newGender is a valid value of the Gender enum
        if (!Object.values(Gender).includes(newGender)) {
            throw new Error("Invalid gender.");
        }
        this.gender = newGender;
    }
    
}

export default Customer;
