// DomainNameCheck.ts
import Domain from "./Domain";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";
import ICheckDomain from "./ICheckDomain";


export default class DomainNameCheck implements ICheckDomain {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog; // state in het object
  }

  checkDomain(domain: Domain, _accountCatalog: IAccountCatalog): Result {
  const domainName = domain.getDomainName();
  const startDateNew = domain.getStartDate();
  const endDateNew = domain.getEndDate();

  const duplicateDomain = this.accountCatalog
    .getAccounts()
    .some(acc => 
      acc.getDomains().some(existingDomain => {
        if (existingDomain.getDomainName() !== domainName) {
          return false; // andere domainName is geen probleem
        }

        const startDateExist = existingDomain.getStartDate();
        const endDateExist = existingDomain.getEndDate();

        // Check overlap
        const overlap = startDateNew < endDateExist && endDateNew > startDateExist;

        return overlap;
      })
    );

  if (duplicateDomain) {
    return new Result(
      false,
      `The domain name ‘${domainName}’ is already associated with an existing account in the overlapping time period.`
    );
  }

  return new Result(true, "Domain name and period are unique; account is valid.");
}


}
