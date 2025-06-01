import Domain from "./Domain";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";
import ICheckDomainHasWebsite from "./ICheckDomainhasWebsite";

export default class WebsiteCheckDomain implements ICheckDomainHasWebsite {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog;
  }

 checkDomainHasWebsite(domainname: string, _accountCatalog: IAccountCatalog): Result {
  for (const acc of this.accountCatalog.getAccounts()) {
    for (const domain of acc.getDomains()) {
      if (domain.getDomainName() === domainname) {
        if (domain.hasWebsite()) {
          return new Result(false, `Domain '${domainname}' already has a website.`);
        } else {
          return new Result(true, `Domain does not have a website yet.`);
        }
      }
    }
  }
  // Domain niet gevonden
  return new Result(false, `Domain '${domainname}' does not exist.`);
}

}
