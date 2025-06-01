// services/hydrateAccountCatalog.ts
import AccountCatalog from '../domain/AccountCatalog';
import CustomerCatalog from '../domain/CustomerCatalog';
import Account        from '../domain/Account';
import Domain         from '../domain/Domain';
import Website        from '../domain/Website';
import Customer       from '../domain/Customer';
import { FileInfo } from './FileInfo';
import { parseDate } from './DateHelper';

import AccountModel from '../infrastructure/models/Model-Account';
import DomainModel  from '../infrastructure/models/Model-Domain';
import WebsiteModel from '../infrastructure/models/Model-Website';
import CustomerModel from '../infrastructure/models/Model-Customer';

export default async function hydrateAccountCatalog(
  accountCatalog: AccountCatalog,
  customerCatalog: CustomerCatalog
) {
  const rows = await AccountModel.findAll({
    include: [
      {
        model: DomainModel,
        as: 'domains',
        include: [{ model: WebsiteModel, as: 'websites' }],
      },
      {
        model: CustomerModel,
        as: 'customer',
      },
    ],
  });

  // Eerst clear beide catalogs
  accountCatalog.clear();
  customerCatalog.clear();

  rows.forEach(r => {
    const a = r.get({ plain: true }) as any;

    // Parse birthdate met helper
    const birthdate = parseDate(a.customer.birthdate);

    // Maak Customer object en voeg toe aan CustomerCatalog
    const customer = new Customer(
      a.customer.firstname,
      a.customer.lastname,
      a.customer.email,
      birthdate,
      a.customer.gender
    );
    customerCatalog.addCustomer(customer);

    // Maak Account object met die Customer erbij
    const account = new Account(
      a.username,
      a.password,
      a.accounttype,
      customer
    );

    // Voeg domains + websites toe aan account
    if (a.domains) {
            a.domains.forEach((d: any) => {
            const domain = new Domain(
                d.domainname,
                d.domainstatus,
                new Date(d.startdatetime),
                new Date(d.enddatetime)
            );

            if (d.websites) {
                d.websites.forEach((w: any) => {
                const fileInfo: FileInfo = {
                    path: w.path,
                    originalname: w.originalname,
                    size: w.size,
                    mimetype: w.mimetype,
                    uploadedat: w.uploadedat ? new Date(w.uploadedat) : new Date(),
                };

                const website = new Website(
                    w.name,
                    w.status,
                    w.type,
                    fileInfo
                );

                domain.tryAddWebsite(website);
                });
            }

    account.tryAddDomain(domain);
    });
}

    // Voeg account toe aan AccountCatalog
    accountCatalog.addAccount(account);
  });
}
