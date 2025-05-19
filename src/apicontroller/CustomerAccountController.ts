import { Request, Response } from 'express';
import AccountRepository from "../infrastructure/repositories/AccountRepository";
import CustomerRepository from "../infrastructure/repositories/CustomerRepository";
import Account from "../domain/Account";
import Customer from "../domain/Customer";
import AccountCatalog from '../domain/AccountCatalog';
import CustomerCatalog from '../domain/CustomerCatalog'; 
import Gender from '../domain/Gender';
import GenderConverter from '../domain/GenderConverter';
import CheckPassword from '../domain/CheckPassword';
import DomainRepository from '../infrastructure/repositories/DomainRepository';
import Domain from '../domain/Domain';


class AccountController {
    private accountRepository: AccountRepository;
    private customerRepository: CustomerRepository;
    private accountCatalog: AccountCatalog;
    private customerCatalog: CustomerCatalog;
    private domainRepository: DomainRepository;
    constructor(
        accountRepo: AccountRepository,
        customerRepo: CustomerRepository,
        accountCatalog: AccountCatalog,
        customerCatalog: CustomerCatalog,
        domainRepo: DomainRepository
    ) {
        this.accountRepository = accountRepo;
        this.customerRepository = customerRepo;
        this.accountCatalog = accountCatalog;
        this.customerCatalog = customerCatalog;
        this.domainRepository = domainRepo;
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
       await this.populateCatalogs(); 
  
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



    async updateAccountAndCustomer(req: Request, res: Response): Promise<Response> {
      const { username } = req.params;
      const { updatedAccountData, updatedCustomerData } = req.body;
  
      console.log('Updating account and customer with username:', username);
      console.log('Updated Account Data:', updatedAccountData);
      console.log('Updated Customer Data:', updatedCustomerData);
      
      try {
          // Stap 1: Vul de catalogus eerst met de meest recente gegevens
          await this.populateCatalogs(); 
  
          // Stap 2: Haal account op uit de catalogus
          const account = this.accountCatalog.getAccountByUsername(username);
  
          if (!account) {
              return res.status(404).json({ error: `Account met username "${username}" niet gevonden.` });
          }
  
          const customer = account.getCustomer();
  
          // Update domeinobject klant
          if (updatedCustomerData.firstName) {
              customer.changeFirstName(updatedCustomerData.firstName);
          }
          if (updatedCustomerData.lastName) {
              customer.changeLastName(updatedCustomerData.lastName);
          }
          if (updatedCustomerData.email) {
              customer.changeEmail(updatedCustomerData.email);
          }
          if (updatedCustomerData.birthdate) {
              customer.changeBirthdate(new Date(updatedCustomerData.birthdate));
          }
          if (updatedCustomerData.gender) {
              customer.changeGender(updatedCustomerData.gender);
          }
  
          // Wachtwoord wijzigen (optioneel)
          if (updatedAccountData.password) {
              const oldPassword = updatedAccountData.oldPassword;
              const newPassword = updatedAccountData.password;
  
              const passwordChangeResult = account.changePassword(oldPassword, newPassword, CheckPassword);
  
              if (!passwordChangeResult.success) {
                  return res.status(400).json({ error: passwordChangeResult.message });
              }
          }
  
          // Werk de objecten bij in de in-memory catalogus
          this.accountCatalog.updateAccount(account);
          this.customerCatalog.updateCustomer(customer);
  
          // ✅ Werk database bij via repository
          await this.accountRepository.updateAccountAndCustomerByUsername(username, {
              password: account.getPassword(),
              accounttype: account.getAccountType()
          }, {
              firstname: customer.getFirstName(),
              lastname: customer.getLastName(),
              email: customer.getEmail(),
              birthdate: customer.getBirthdate(),
              gender: customer.getGender()
          });
  
          return res.status(200).json({
              message: 'Account en klant succesvol bijgewerkt.',
              account: account,
              customer: customer
          });
  
      } catch (error: any) {
          console.error('Fout bij het bijwerken van account/klant:', error.message);
          return res.status(500).json({ error: 'Er is iets mis gegaan bij het bijwerken van het account en de klant.' });
      }
  }
  
  // Functie om de catalogus bij te werken met gegevens uit de database
  async populateCatalogs(): Promise<void> {
      const accounts = await this.accountRepository.getAllAccounts();
      const customers = await this.customerRepository.getAllCustomers();
  
      this.accountCatalog.clear(); 
      this.customerCatalog.clear(); 
  
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
  }

  
  
  async getAllAccountCustomer(req: Request, res: Response): Promise<Response> {
    try {
        // Stap 1: Haal alle accounts en klanten op
        const accounts = await this.accountRepository.getAllAccounts();
        const customers = await this.customerRepository.getAllCustomers();

        // Haal alle domeinen op per account
        const domains = await this.domainRepository.getAllDomains();  // Dit haalt alle domeinen op, zorg ervoor dat deze functie goed werkt.
        
        this.accountCatalog.clear(); 
        this.customerCatalog.clear(); 

        // Stap 2: Verwerk de accounts en koppel klanten
        accounts.forEach((acc: any) => {
            const customer = customers.find((cust: any) => cust.CustomerID === acc.CustomerID);
            if (customer) {
                const gender = GenderConverter.fromString(customer.gender);
                const newCustomer = new Customer(customer.firstname, customer.lastname, customer.email, new Date(customer.birthdate), gender);
                const newAccount = new Account(acc.username, acc.password, acc.accounttype, newCustomer);
                
                // Stap 3: Haal de domeinen op voor dit account
                const accountDomains = domains.filter((domain: any) => domain.username === acc.username);
                
                // Voeg domeinen toe aan account
                accountDomains.forEach((domain: any) => {
                    const domainInstance = new Domain(domain.domainname, domain.domainstatus, domain.startdatetime, domain.enddatetime);
                    newAccount.tryAddDomain(domainInstance);  // Zorg ervoor dat de Account klasse een addDomain methode heeft.
                });

                // Voeg toe aan de catalogus
                this.accountCatalog.addAccount(newAccount);
                this.customerCatalog.addCustomer(newCustomer); 
            }
        });

        // Stap 4: Combineer de gegevens voor de frontend
        const customerMap = new Map();
        customers.forEach((customer: any) => {
            customerMap.set(customer.CustomerID, customer);
        });

        // Stap 5: Combineer account- en domeingegevens
        const combinedData = accounts.map((account: any) => {
            const customer = customerMap.get(account.CustomerID);

            // Verkrijg de domeinen die bij dit account horen (als ze zijn toegevoegd)
            const accountInstance = this.accountCatalog.getAccountByUsername(account.username);
            const domains = accountInstance ? accountInstance.getDomains() : [];

            return {
                username: account.username,
                accountType: account.accounttype,
                firstName: customer.firstname,
                lastName: customer.lastname,
                email: customer.email,
                birthDate: customer.birthdate,
                gender: customer.gender,
                domains: domains.map((domain: Domain) => ({
                    domainName: domain.getDomainName(),
                    domainStatus: domain.getDomainstatus(),
                    startDate: domain.getStartDate(),
                    endDate: domain.getEndDate(),
                }))
            };
        });

        return res.status(200).json(combinedData);

    } catch (error) {
        console.error("Error fetching accounts/customers:", error); 
        return res.status(500).json({ error: 'Something went wrong while fetching account-customer data.' });
    }
}

      
    

    
}

export default AccountController;
