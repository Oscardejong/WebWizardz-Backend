/* src/apicontroller/AccountController.ts */
import { Request, Response } from 'express';

import AccountRepository   from '../infrastructure/repositories/AccountRepository';
import CustomerRepository  from '../infrastructure/repositories/CustomerRepository';
import DomainRepository    from '../infrastructure/repositories/DomainRepository';

import IAccountCatalog     from '../domain/IAccountCatalog';
import ICustomerCatalog    from '../domain/ICustomerCatalog';

import Account             from '../domain/Account';
import Customer            from '../domain/Customer';
import Domain              from '../domain/Domain';
import GenderConverter     from '../domain/GenderConverter';

import CheckPassword       from '../domain/CheckPassword';
import AccountUsernameCheck   from '../domain/AccountUsernameCheck';
import CustomerEmailCheck     from '../domain/CustomerEmailCheck';
import ICheckAccountAndUser   from '../domain/ICheckAccountandCustomer';

class AccountController {
  constructor(
    private accountRepo : AccountRepository,
    private customerRepo: CustomerRepository,
    private accountCatalog : IAccountCatalog,
    private customerCatalog: ICustomerCatalog,
    private domainRepo    : DomainRepository
  ) {}

  /* ─────────────────────────── CREATE ─────────────────────────── */
  async addAccountAndCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const {
        firstName, lastName, email, birthdate,
        gender, username, password, accounttype
      } = req.body;

      /* 1) Basis-validatie */
      const required = { firstName, lastName, email, birthdate, gender, username, password, accounttype };
      for (const [k, v] of Object.entries(required)) {
        if (!v) return res.status(400).json({ error: `Missing field ${k}` });
      }
      if (isNaN(Date.parse(birthdate))) {
        return res.status(400).json({ error: 'Invalid birthdate' });
      }

      /* 2) Maak domeinobjecten */
      const customer = new Customer(firstName, lastName, email, new Date(birthdate), gender);
      const account  = new Account(username, password, accounttype, customer);

      /* 3) Business-validators */
      const validators: ICheckAccountAndUser[] = [
        new AccountUsernameCheck(this.accountCatalog),
        new CustomerEmailCheck(this.customerCatalog)
      ];
      for (const v of validators) {
        const result = v.checkAccountAndUser(account, customer, this.accountCatalog, this.customerCatalog);
        if (!result.success) return res.status(400).json({ error: result.message });
      }

      /* 4) Wachtwoord-check */
      const pw = CheckPassword(password);
      if (!pw.success) return res.status(400).json({ error: pw.message });

      /* 5) Persisteren */
      const dbCustomer = await this.customerRepo.insertCustomer({
        firstname: customer.getFirstName(),
        lastname : customer.getLastName(),
        email    : customer.getEmail(),
        birthdate: customer.getBirthdate(),
        gender   : customer.getGender()
      });

      await this.accountRepo.createAccount({
        username,
        password: account.getPassword(),
        CustomerID: dbCustomer.CustomerID,
        accounttype
      });

      /* 6) Catalogi bijwerken */
      this.customerCatalog.addCustomer(customer);
      this.accountCatalog.addAccount(account);

      return res.status(201).json({ message: 'Account successfully created' });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  /* ─────────────────────────── UPDATE (alleen klant-velden) ─────────────────────────── */
  async updateAccountAndCustomer(req: Request, res: Response): Promise<Response> {
    const { username } = req.params;
    const { firstName, lastName, birthdate, gender } = req.body;

    try {
      const account = this.accountCatalog.getAccountByUsername(username);
      if (!account) return res.status(404).json({ error: 'Account not found' });

      const customer = account.getCustomer();
      const dbUpdates: any = {};

      if (firstName !== undefined) {
        customer.changeFirstName(firstName);
        dbUpdates.firstname = firstName;
      }
      if (lastName !== undefined) {
        customer.changeLastName(lastName);
        dbUpdates.lastname = lastName;
      }
      if (birthdate !== undefined) {
        const bd = new Date(birthdate);
        if (isNaN(bd.getTime())) return res.status(400).json({ error: 'Invalid birthdate' });
        customer.changeBirthdate(bd);
        dbUpdates.birthdate = bd;
      }
      if (gender !== undefined) {
        customer.changeGender(gender);
        dbUpdates.gender = gender;
      }
      if (Object.keys(dbUpdates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      /* repo-update, alleen klantvelden */
      await this.accountRepo.updateAccountAndCustomerByUsername(username, {}, dbUpdates);

      /* catalogus bijwerken */
      this.customerCatalog.updateCustomer(customer);

      return res.status(200).json({ message: 'Customer updated' });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  /* ─────────────────────────── DELETE ─────────────────────────── */
  async deleteAccountByUsername(req: Request, res: Response): Promise<Response> {
    const { username } = req.params;
    try {
      await this.accountRepo.deleteAccountByUsername(username);

      const acc = this.accountCatalog.getAccountByUsername(username);
      if (acc) {
        const mail = acc.getCustomer().getEmail();
        this.accountCatalog.deleteAccountByUsername(username);
        this.customerCatalog.deleteCustomerByEmail(mail);
      }
      return res.status(200).json({ message: 'Deleted' });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  /* ─────────────────────────── READ ─────────────────────────── */
  async getAllAccountCustomer(_req: Request, res: Response): Promise<Response> {
    try {
      const accounts = this.accountCatalog.getAccounts();
      const payload = accounts.map(acc => {
        const cust = acc.getCustomer();
        return {
          username  : acc.getUserName(),
          accountType: acc.getAccountType(),
          firstName : cust.getFirstName(),
          lastName  : cust.getLastName(),
          email     : cust.getEmail(),
          birthDate : cust.getBirthdate(),
          gender    : cust.getGender(),
          domains   : acc.getDomains().map((d: Domain) => ({
            domainname : d.getDomainName(),
            domainstatus: d.getDomainstatus(),
            startdate  : d.getStartDate(),
            enddate    : d.getEndDate()
          }))
        };
      });
      return res.status(200).json(payload);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

export default AccountController;
