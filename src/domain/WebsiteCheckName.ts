import Website from "./Website";
import Result from "./Result";
import IAccountCatalog from "./IAccountCatalog";
import ICheckWebsite from "./ICheckWebsite";

export default class WebsiteCheckName implements ICheckWebsite {
  private accountCatalog: IAccountCatalog;

  constructor(accountCatalog: IAccountCatalog) {
    this.accountCatalog = accountCatalog;
  }

  check(website: Website, _accountCatalog: IAccountCatalog): Result {
    const websiteName = website.getName();

    const duplicateWebsite = this.accountCatalog
      .getAccounts()
      .some(account =>
        account.getDomains().some(domain =>
          domain.getWebsites().some(existingWebsite =>
            existingWebsite.getName() === websiteName
          )
        )
      );

    if (duplicateWebsite) {
      return new Result(
        false,
        `The website name ‘${websiteName}’ is already associated with an existing website.`
      );
    }

    return new Result(true, "Website name is unique; website is valid.");
  }
}
