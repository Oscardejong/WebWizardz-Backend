import AccountType from './AccountType';
import Result from './Result';
import CheckPassword from './CheckPassword';
import Payment from './payment';
import Domain from './Domain';

class Account {
    private username: string;
    private password: string;
    private accountType: AccountType;
    private payments: Payment[];
    private domains: Domain[];

    getAccountType(): AccountType {
        return this.accountType;
    }
    getPassword(): string {
        return this.password;
    }
    getUserName(): string {
        return this.username;
    }

    getPayments(): readonly Payment[] { 
        return this.payments;
    }
    getDomains(): readonly Domain[] { 
        return this.domains;
    }

    constructor(username: string, password: string, accountType: AccountType) {
        this.username = username;
        this.password = password;
        this.accountType = accountType;
        this.payments = [];
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

    tryAddPayment(): Result {
        return new Result(true, 'Payment added successfully');
    }

    tryAddDomain(): Result {
        return new Result(true, 'Domain added successfully');
    }

    changePassword(oldPassword: string, newPassword: string, checkPassword: typeof CheckPassword): Result {
        const validationResult = checkPassword(oldPassword, newPassword, this);

        if (!validationResult.success) {
            return validationResult;
        }

        this.password = newPassword;
        return new Result(true, 'Password changed successfully');
    }
}

export default Account;
