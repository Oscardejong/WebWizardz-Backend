// AccountUsernameCheck.ts
import Account from "./Account";
import Customer from "./Customer";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";
import ICustomerCatalog from "./ICustomerCatalog";
import ICheckAccountandCustomer from "./ICheckAccountandCustomer";

export default class AccountUsernameCheck implements ICheckAccountandCustomer {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog; // state in het object
  }

  checkAccountAndUser(
    account: Account,
    _customer: Customer,
    _accCatalog: IAccountCatalog,
    _custCatalog: ICustomerCatalog
  ): Result {
    const accountUsername = account.getUsername();

    const duplicateAccount = this.accountCatalog
      .getAccounts()
      .some(acc => acc.getUsername() === accountUsername);

    if (duplicateAccount) {
      return new Result(
        false,
        `The username ‘${accountUsername}’ is already associated with an existing account.`
      );
    }

    return new Result(true, "Username is unique; account and customer are valid.");
  }
}
