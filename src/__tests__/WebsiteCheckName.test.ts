import WebsiteCheckName from "../domain/WebsiteCheckName";
import Website from "../domain/Website";
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";
import Account from "../domain/Account";
import Domain from "../domain/Domain";

describe("WebsiteCheckName", () => {
  const mockWebsiteName = "mywebsite";

  function createMockAccountCatalog(accounts: Account[]): IAccountCatalog {
    return {
      getAccounts: () => accounts,
      addAccount: jest.fn(),
      updateAccount: jest.fn(),
      clear: jest.fn(),
      deleteAccountByUsername: jest.fn(),
      getAccountByUsername: jest.fn(),
    };
  }

  it("returns failure Result if website name already exists", () => {
    // Arrange
    const existingWebsite = {
      getName: () => mockWebsiteName,
    } as unknown as Website;

    const domainWithWebsite = {
      getWebsites: () => [existingWebsite],
    } as unknown as Domain;

    const accountWithDomain = {
      getDomains: () => [domainWithWebsite],
    } as unknown as Account;

    const mockAccountCatalog = createMockAccountCatalog([accountWithDomain]);

    const checker = new WebsiteCheckName(mockAccountCatalog);

    const newWebsite = {
      getName: () => mockWebsiteName,
    } as unknown as Website;

    // Act
    const result = checker.check(newWebsite, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("already associated");
  });

  it("returns success Result if website name is unique", () => {
    // Arrange
    const existingWebsite = {
      getName: () => "otherwebsite",
    } as unknown as Website;

    const domainWithWebsite = {
      getWebsites: () => [existingWebsite],
    } as unknown as Domain;

    const accountWithDomain = {
      getDomains: () => [domainWithWebsite],
    } as unknown as Account;

    const mockAccountCatalog = createMockAccountCatalog([accountWithDomain]);

    const checker = new WebsiteCheckName(mockAccountCatalog);

    const newWebsite = {
      getName: () => mockWebsiteName,
    } as unknown as Website;

    // Act
    const result = checker.check(newWebsite, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("unique");
  });
});
