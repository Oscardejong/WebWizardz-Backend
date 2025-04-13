import AccountRepository from "../infrastructure/repositories/AccountRepository";
import Result from "./Result";
import Account from "./Account";

class AccountCatalog {
    private accounts: Account[] = []; 
    private repository: AccountRepository;

    getAccounts(): readonly Account[] {
        return this.accounts;
    } 
    

    constructor() {
        this.repository = new AccountRepository(); 
    }

    // async addAccount(accountData: Account): Promise<Result> {
    //     try {
    //         // const account = await this.repository.createAccount(accountData);
    //         this.accounts.push(account);
    //         return new Result(true, 'Account successfully saved');
    //     } catch (error) {
    //         console.error('Error saving account:', error);
    //         return new Result(false, 'Account could not be saved');
    //     }
    // }
    public addAccount(account: Account): Result {
        this.accounts.push(account);
        return new Result(true, 'Account successfully saved');
    }

    clear(): void {
        this.accounts = [];
      }
    
    deleteAccountByUsername(username: string): void {
        this.accounts = this.accounts.filter(account => account.getUserName() !== username);
    }

    getAccountByUsername(username: string): Account | undefined {
        return this.accounts.find(account => account.getUserName() === username);
    }

        
}

export default AccountCatalog;
