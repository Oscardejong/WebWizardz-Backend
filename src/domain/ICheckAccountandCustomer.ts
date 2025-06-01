import Account from "./Account";
import Result from "./Result";
import Customer from "./Customer";
import IAccountCatalog from "./IAccountCatalog";
import ICustomerCatalog from "./ICustomerCatalog";

interface ICheckAccountAndUser {
    checkAccountAndUser(account: Account, customer: Customer, accountCatalog: IAccountCatalog, customerCatalog: ICustomerCatalog): Result;

}


export default ICheckAccountAndUser;