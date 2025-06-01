import Website from "./Website";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";

interface ICheckWebsite {
    check(website: Website, accountCatalog: IAccountCatalog): Result;

}

export default ICheckWebsite;