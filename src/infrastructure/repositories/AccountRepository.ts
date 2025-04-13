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

}

export default AccountRepository;
