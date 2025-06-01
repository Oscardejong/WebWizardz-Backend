import Domain from "./Domain";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";

interface ICheckDomain {
    checkDomain(domain: Domain, accountCatalog: IAccountCatalog): Result;
}

export default ICheckDomain;