import Result from "./Result";
import ICheckDomain from "./ICheckDomain";
import Domain from "./Domain";

class CheckDomainName implements ICheckDomain {
    public checkDomain(domain: Domain): Result {
        


        return new Result(true, `Domain name ${domain.getDomainName} is valid`);
    }
}

export default CheckDomainName;