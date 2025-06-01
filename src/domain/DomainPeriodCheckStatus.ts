import Domain from "./Domain";
import Result from "./Result";
import ICheckDomainUpdate from "./ICheckDomainUpdate";
import IAccountCatalog from "./IAccountCatalog";
import DomainStatus from "./Domainstatus";

export default class DomainPeriodCheckStatus implements ICheckDomainUpdate {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog;
  }

  checkDomainUpdate(domain: Domain, newStart: Date, newEnd: Date): Result {
    if (domain.getDomainstatus() === DomainStatus.ONLINE) {
      return new Result(false, "Cannot update period for a domain with status ONLINE.");
    }

    return new Result(true, "Domain status is valid for period update.");
  }
}
