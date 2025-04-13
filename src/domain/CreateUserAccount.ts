import Account from './Account';
import Result from './Result';
import AccountType from './AccountType';
import CustomerCatalog from './CustomerCatalog';
import AccountCatalog from './AccountCatalog';
import Customer from './Customer';
import Gender from './Gender';

const customerCatalog = new CustomerCatalog();
const accountCatalog = new AccountCatalog();

interface CustomerData {
    firstname: string;
    lastname: string;
    email: string;
    birthdate: Date;
    gender: Gender;
}

interface AccountData {
    username: string;
    password: string;
    accountType: AccountType;
    customer: Customer;
}

class CreateUserAccount {
    public static async createUserAccount(customerData: CustomerData, accountData: AccountData): Promise<Result> {
        // Stap 1: Validatie van het e-mailadres
        if (!customerData.email.includes('@')) {
            return new Result(false, 'Invalid email address');
        }

        // Stap 2: Klant aanmaken
        const customer = new Customer(
            customerData.firstname,
            customerData.lastname,
            customerData.email,
            customerData.birthdate,
            customerData.gender
        );

        const customerResult = await customerCatalog.addCustomer(customer);  // Zorg ervoor dat dit een async functie is
        if (!customerResult.success) {
            return new Result(false, 'Customer could not be saved');
        }

        // Stap 3: Account aanmaken
        const accountResult = await accountCatalog.addAccount(  // Zorg ervoor dat dit een async functie is
            new Account(
                accountData.username,
                accountData.password,
                accountData.accountType,
                customer
            )
        );

        if (!accountResult.success) {
            return new Result(false, 'Account could not be saved');
        }

        // Stap 4: Account en klant zijn succesvol gecreëerd
        return new Result(true, `${accountData.username} successfully created`);
    }
}

export default CreateUserAccount;
