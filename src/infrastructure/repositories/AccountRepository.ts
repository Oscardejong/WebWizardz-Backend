import Account from '../models/Model-Account';
import bcryptjs from 'bcryptjs';
import AccountType from '../../domain/AccountType'; 
import Customer from '../models/Model-Customer';

class AccountRepository {

    async createAccount(accountData: {
        username: string;
        password: string;
        CustomerID: number;
        accounttype: AccountType; 
    }): Promise<Account> {
       
        const hashedPassword = bcryptjs.hashSync(accountData.password, 10);

        return await Account.create({
            ...accountData,
            password: hashedPassword, 
        });
    }

    async getAllAccounts(): Promise<Account[]> {
        return await Account.findAll();  
    }

    async getUsernameByAccountId(accountId: number): Promise<string | null> {
        const account = await Account.findOne({ where: { AccountID: accountId } });
        return account ? account.username : null;
    }

    async getAccountByUsername(username: string): Promise<Account | null> {
        return await Account.findOne({
            where: {
                username: username
            }
        });
    }

    async deleteAccountByUsername(username: string): Promise<void> {
        const account = await Account.findOne({ where: { username } });
    
        if (!account) {
            throw new Error(`Account met username "${username}" bestaat niet.`);
        }
    
        const customerID = account.CustomerID;
        await account.destroy();
    
        // Dan de gekoppelde customer verwijderen
        const customer = await Customer.findOne({ where: { CustomerID: customerID } });
    
        if (customer) {
            await customer.destroy();
        }
    }

    async updateAccountAndCustomerByUsername(
        username: string,
        updatedAccountData: Partial<Account>,
        updatedCustomerData: Partial<Customer>
    ): Promise<{ account: Account; customer: Customer } | null> {
        const account = await Account.findOne({ where: { username } });
    
        if (!account) {
            console.error(`Account met username "${username}" niet gevonden.`);
            return null;
        }
    
        const customer = await Customer.findOne({ where: { CustomerID: account.CustomerID } });
    
        if (!customer) {
            console.error(`Customer met ID ${account.CustomerID} niet gevonden.`);
            return null;
        }
    
        // Wachtwoord versleutelen als het aangepast wordt
        if (updatedAccountData.password) {
            updatedAccountData.password = bcryptjs.hashSync(updatedAccountData.password, 10);
        }
    
        await account.update(updatedAccountData);
        await customer.update(updatedCustomerData);
    
        console.log("Account & Customer bijgewerkt:");
        console.log("Account:", account.toJSON());
        console.log("Customer:", customer.toJSON());
    
        return { account, customer };
    }
    
    

}

export default AccountRepository;
