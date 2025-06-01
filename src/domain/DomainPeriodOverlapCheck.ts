// domain/DomainPeriodOverlapCheck.ts
import Domain from './Domain';
import Result from './Result';
import ICheckDomainUpdate from './ICheckDomainUpdate';
import IAccountCatalog from './IAccountCatalog';

export default class DomainPeriodOverlapCheck implements ICheckDomainUpdate {
  constructor(private accountCatalog: IAccountCatalog) {}

  checkDomainUpdate(currentDomain: Domain, newStart: Date, newEnd: Date): Result {
    const domainName = currentDomain.getDomainName();

    // loop over alle accounts → domeinen met dezelfde naam,
    // MAAR sla het eigen domein (currentDomain) zelf over
    const hasOverlap = this.accountCatalog.getAccounts().some(acc =>
      acc.getDomains().some(other => {
        if (other === currentDomain) return false;         
        if (other.getDomainName() !== domainName) return false;

        const startExist = other.getStartDate();
        const endExist   = other.getEndDate();

        // overlap?
        return newStart < endExist && newEnd > startExist;
      })
    );

    if (hasOverlap) {
      return new Result(
        false,
        `Domain '${domainName}' already exists in an overlapping period for another record.`
      );
    }
    return new Result(true, 'No overlap detected');
  }
}
