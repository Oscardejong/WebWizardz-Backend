import Domain from "./Domain";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";

interface ICheckDomainHasWebsite {
    checkDomainHasWebsite(domainname: string, accountCatalog: IAccountCatalog): Result;
}
export default ICheckDomainHasWebsite;