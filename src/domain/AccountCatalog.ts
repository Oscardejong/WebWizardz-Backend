import AccountRepository from "../infrastructure/repositories/AccountRepository";
import Result from "./Result";
import Account from "./Account";
import IAccountCatalog from "./IAccountCatalog";

class AccountCatalog implements IAccountCatalog {
    private accounts: Account[] = []; 
    private repository: AccountRepository;

    getAccounts(): readonly Account[] {
        return this.accounts;
    } 
    

    constructor() {
        this.repository = new AccountRepository(); 
    }

    public addAccount(account: Account): Result {
        this.accounts.push(account);
        return new Result(true, 'Account successfully saved');
    }
    
    updateAccount(account: Account): void {
        // Zoek naar het account met dezelfde username en vervang het
        const index = this.accounts.findIndex(acc => acc.getUserName() === account.getUserName());
        if (index !== -1) {
            this.accounts[index] = account;
        }
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
