import Domain from "./Domain";
import Result from "./Result";

interface ICheckDomain {
    checkDomain(domain: Domain): Result;
}

export default ICheckDomain;