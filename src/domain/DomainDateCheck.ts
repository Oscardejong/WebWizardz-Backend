// DomainNameCheck.ts
import Domain from "./Domain";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";
import ICheckDomain from "./ICheckDomain";


export default class DomainDateCheck implements ICheckDomain {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog; // state in het object
  }

 checkDomain(domain: Domain, _accountCatalog: IAccountCatalog): Result {
  const startDate = domain.getStartDate();
  const endDate = domain.getEndDate();

  const now = new Date();

  // Check 1: startDate mag niet in het verleden liggen
  if (startDate < now) {
    return new Result(
      false,
      `The domain start date ‘${startDate.toISOString()}’ cannot be earlier than the current date and time.`
    );
  }

  // Check 2: verschil tussen start en eind moet minimaal 24 uur zijn
  const durationMs = endDate.getTime() - startDate.getTime();
  const minDurationMs = 24 * 60 * 60 * 1000; // 24 uur in milliseconden

  if (durationMs < minDurationMs) {
    return new Result(
      false,
      `The domain period must be at least 24 hours long.`
    );
  }

  return new Result(true, "Domain date is valid; account is valid.");
}

}
