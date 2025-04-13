import { Request, Response } from 'express';
import AccountRepository from "../infrastructure/repositories/AccountRepository";
import CustomerRepository from "../infrastructure/repositories/CustomerRepository";
import Account from "../domain/Account";
import Customer from "../domain/Customer";
import AccountCatalog from '../domain/AccountCatalog';
import CustomerCatalog from '../domain/CustomerCatalog'; 
import Gender from '../domain/Gender';
import GenderConverter from '../domain/GenderConverter';

class AccountController {
    private accountRepository: AccountRepository;
    private customerRepository: CustomerRepository;
    private accountCatalog: AccountCatalog;
    private customerCatalog: CustomerCatalog;

    constructor(
        accountRepo: AccountRepository,
        customerRepo: CustomerRepository,
        accountCatalog: AccountCatalog,
        customerCatalog: CustomerCatalog
    ) {
        this.accountRepository = accountRepo;
        this.customerRepository = customerRepo;
        this.accountCatalog = accountCatalog;
        this.customerCatalog = customerCatalog;
    }

    async getAllAccountCustomer(req: Request, res: Response): Promise<Response> {
        try {
          const accounts = await this.accountRepository.getAllAccounts();
          const customers = await this.customerRepository.getAllCustomers();
      
          // 🧠 Vul de accountCatalog leeg + opnieuw
          this.accountCatalog.clear(); // Zorg dat deze bestaat in je AccountCatalog
          this.customerCatalog.clear(); // Zorg dat deze bestaat in je CustomerCatalog
          accounts.forEach((acc: any) => {
            const customer = customers.find((cust: any) => cust.CustomerID === acc.CustomerID);
            if (customer) {
              const gender = GenderConverter.fromString(customer.gender);
              const newCustomer = new Customer(customer.firstname, customer.lastname, customer.email, new Date(customer.birthdate), gender);
              const newAccount = new Account(acc.username, acc.password, acc.accounttype, newCustomer);
              this.accountCatalog.addAccount(newAccount);
              this.customerCatalog.addCustomer(newCustomer); 

            }
          });
      
          // Combine voor frontend (zoals je al deed)
          const customerMap = new Map();
          customers.forEach((customer: any) => {
            customerMap.set(customer.CustomerID, customer);
          });
      
          const combinedData = accounts.map((account: any) => {
            const customer = customerMap.get(account.CustomerID);
            return {
              username: account.username,
              accountType: account.accounttype,
              firstName: customer.firstname,
              lastName: customer.lastname,
              email: customer.email,
              birthDate: customer.birthdate,
              gender: customer.gender
            };
          });
      
          return res.status(200).json(combinedData);
      
        } catch (error) {
          console.error("Error fetching accounts/customers:", error); 
          return res.status(500).json({ error: 'Something went wrong while fetching account-customer data.' });
        }
      }
      
    
    async addAccountAndCustomer(req: Request, res: Response): Promise<Response> {
        try {
            console.log('Request body:', req.body);  // Toon de volledige request
    
            const requiredFields = ['firstName', 'lastName', 'email', 'birthdate', 'gender', 'username', 'password', 'accounttype'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    console.warn(`Missing required field: ${field}`);
                    return res.status(400).json({ error: `Missing required field: ${field}` });
                }
            }
    
            const { firstName, lastName, email, birthdate, gender, username, password, accounttype } = req.body;
    
            // Extra validatie & logging
            if (isNaN(Date.parse(birthdate))) {
                console.warn('Invalid date format for birthdate:', birthdate);
                return res.status(400).json({ error: 'Invalid date format for birthdate' });
            }
    
            // Eventueel: validatie voor email/gender/accounttype formats hier
    
            const newCustomer = new Customer(firstName, lastName, email, new Date(birthdate), gender);
            this.customerCatalog.addCustomer(newCustomer);
            console.log('New customer created:', newCustomer);
    
            const createdCustomer = await this.customerRepository.insertCustomer({
                firstname: newCustomer.getFirstName(),
                lastname: newCustomer.getLastName(),
                email: newCustomer.getEmail(),
                birthdate: newCustomer.getBirthdate(),
                gender: newCustomer.getGender(),
            });
            console.log('Customer inserted into DB:', createdCustomer);
    
            const newAccount = new Account(username, password, accounttype, newCustomer);
            this.accountCatalog.addAccount(newAccount);
            console.log('New account created:', newAccount);
    
            const createdAccount = await this.accountRepository.createAccount({
                username: newAccount.getUserName(),
                password: newAccount.getPassword(),
                CustomerID: createdCustomer.CustomerID,
                accounttype: newAccount.getAccountType()
            });
            console.log('Account inserted into DB:', createdAccount);
    
            return res.status(201).json({
                message: 'Account successfully created',
                customer: createdCustomer,
                account: createdAccount
            });
    
        } catch (error: any) {
            console.error("Error adding account:", error.message);
            console.error("Stack trace:", error.stack);
            return res.status(500).json({ error: 'Something went wrong while adding the account.' });
        }
    }

    async deleteAccountByUsername(req: Request, res: Response): Promise<Response> {
        const { username } = req.params;  
      
        try {
          // ✅ Verwijder uit database
          await this.accountRepository.deleteAccountByUsername(username);
      
          // ✅ Verwijder uit catalogus
          const account = this.accountCatalog.getAccountByUsername(username);
          if (account) {
            const email = account.getCustomer().getEmail();
            this.accountCatalog.deleteAccountByUsername(username);
            this.customerCatalog.deleteCustomerByEmail(email); 
          }
      
          return res.status(200).json({ message: `Account and associated customer with username "${username}" have been successfully deleted.` });
      
        } catch (error: unknown) {
          console.error('Error while deleting account:', error);
      
          if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(500).json({ error: 'An unknown error occurred.' });
          }
        }
      }
    
}

export default AccountController;
