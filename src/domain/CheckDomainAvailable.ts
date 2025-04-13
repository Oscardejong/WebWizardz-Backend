import Domain from "./Domain";
import Result from "./Result";
import ICheckDomain from "./ICheckDomain";

class CheckDomainAvailable implements ICheckDomain {
    public checkDomain(domain: Domain): Result {
        // Voeg logica toe om te controleren of het domein beschikbaar is
        return new Result(true, `Domain ${domain.getDomainName} is available`);
    }
}

export default CheckDomainAvailable;