import Domain from "./Domain";
import Result from "./Result";
import ICheckDomainUpdate from "./ICheckDomainUpdate";
import IAccountCatalog from "./IAccountCatalog";

export default class DomainPeriodCheckDate implements ICheckDomainUpdate {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog;
  }

  checkDomainUpdate(domain: Domain, newStart: Date, newEnd: Date): Result {
    // Check 1: Are both dates valid?
    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      return new Result(false, "One or both provided dates are invalid.");
    }

    // Check 2: Start must be before end
    if (newStart >= newEnd) {
      return new Result(false, "The start date must be before the end date.");
    }

    // (Optional) Check 3: End date must not be entirely in the past
    const now = new Date();
    if (newEnd < now) {
      return new Result(false, "The date period cannot be entirely in the past.");
    }

    // All checks passed
    return new Result(true, "Date validation passed.");
  }
}
