import AccountType from './AccountType';
import Result from './Result';
import CheckPassword from './CheckPassword';
import Payment from './Payment';
import Domain from './Domain';
import Customer from './Customer';

class Account {
    private username: string;
    private password: string;
    private accountType: AccountType;
    private customer: Customer

    private domains: Domain[];

    getUsername(): string {
        return this.username;
    }
    getAccountType(): AccountType {
        return this.accountType;
    }
    getPassword(): string {
        return this.password;
    }
    getUserName(): string {
        return this.username;
    }

    // getPayments(): readonly Payment[] { 
    //     return this.payments;
    // }
    getDomains(): readonly Domain[] { 
        return this.domains;
    }
    getCustomer(): Customer {
        return this.customer;
    }

    constructor(username: string, password: string, accountType: AccountType, Customer: Customer) {
        this.customer = Customer;
        this.username = username;
        this.password = password;
        this.accountType = accountType;

        // this.payments = [];
        this.domains = [];
    }

    verifyPassword(oldPassword: string): boolean {
        return this.password === oldPassword;
    }

    // Login-methode
    login(): Result {
        if (this.username && this.password) {
            return new Result(true, 'Login successful');
        } else {
            return new Result(false, 'Login failed');
        }
    }

    // tryAddPayment(payment: Payment): Result {
    //     if (!payment) {
    //         return new Result(false, 'Invalid payment');
    //     }
    //     this.payments.push(payment);        
    //     return new Result(true, 'Payment added successfully');
    // }
    tryAddDomain(domain: Domain): Result {
        if (!domain) {
            return new Result(false, 'Invalid domain');
        }
        this.domains.push(domain);
        return new Result(true, 'Domain added successfully');
    }

}

export default Account;
