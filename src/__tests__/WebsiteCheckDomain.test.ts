import WebsiteCheckDomain from "../domain/WebsiteCheckDomain";
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";
import Account from "../domain/Account";
import Domain from "../domain/Domain";

describe("WebsiteCheckDomain", () => {
  // Helper om mock Domain te maken
  function createMockDomain(name: string, hasWebsite: boolean): Domain {
    return {
      getDomainName: () => name,
      hasWebsite: () => hasWebsite,
    } as unknown as Domain;
  }

  // Helper om mock Account te maken met domains
  function createMockAccount(domains: Domain[]): Account {
    return {
      getDomains: () => domains,
    } as unknown as Account;
  }

  // Helper om mock IAccountCatalog te maken
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

  it("should return failure Result if domain already has a website", () => {
    // Arrange
    const domainName = "example.com";
    const domainWithWebsite = createMockDomain(domainName, true);
    const account = createMockAccount([domainWithWebsite]);
    const mockAccountCatalog = createMockAccountCatalog([account]);
    const checker = new WebsiteCheckDomain(mockAccountCatalog);

    // Act
    const result = checker.checkDomainHasWebsite(domainName, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("already has a website");
  });

  it("should return success Result if domain does not have a website", () => {
    // Arrange
    const domainName = "example.com";
    const domainWithoutWebsite = createMockDomain(domainName, false);
    const account = createMockAccount([domainWithoutWebsite]);
    const mockAccountCatalog = createMockAccountCatalog([account]);
    const checker = new WebsiteCheckDomain(mockAccountCatalog);

    // Act
    const result = checker.checkDomainHasWebsite(domainName, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("does not have a website yet");
  });

  it("should return failure Result if domain does not exist", () => {
    // Arrange
    const domainName = "nonexistent.com";
    const domain = createMockDomain("example.com", false);
    const account = createMockAccount([domain]);
    const mockAccountCatalog = createMockAccountCatalog([account]);
    const checker = new WebsiteCheckDomain(mockAccountCatalog);

    // Act
    const result = checker.checkDomainHasWebsite(domainName, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("does not exist");
  });
});

