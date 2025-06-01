// CustomerEmailCheck.ts
import Account from "./Account";
import Customer from "./Customer";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";
import ICustomerCatalog from "./ICustomerCatalog";
import ICheckAccountandCustomer from "./ICheckAccountandCustomer";

export default class CustomerEmailCheck implements ICheckAccountandCustomer {
  private customerCatalog: ICustomerCatalog;

  constructor(customerCatalog: ICustomerCatalog) {
    this.customerCatalog = customerCatalog;
  }

  checkAccountAndUser(
    _account: Account,
    customer: Customer,
    _accountCatalog: IAccountCatalog,
    _customerCatalog: ICustomerCatalog
  ): Result {
    const customerEmail = customer.getEmail();

    const duplicateCustomer = this.customerCatalog
      .getCustomers()
      .some(cust => cust.getEmail() === customerEmail);

    if (duplicateCustomer) {
      return new Result(
        false,
        `The email address ‘${customerEmail}’ is already associated with an existing customer.`
      );
    }

    return new Result(true, "Email is unique; account and customer are valid.");
  }
}
