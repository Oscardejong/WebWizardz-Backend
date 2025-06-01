import DomainPeriodOverlapCheck from "../domain/DomainPeriodOverlapCheck";
import Domain from "../domain/Domain";
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";
import Account from "../domain/Account";

describe("DomainPeriodOverlapCheck", () => {
  // Helper: maak een mock Domain met minimale implementatie
  function createMockDomain(
    name: string,
    start: Date,
    end: Date
  ): Domain {
    return {
      getDomainName: () => name,
      getStartDate: () => start,
      getEndDate: () => end,
    } as unknown as Domain;
  }

  // Helper: maak een mock Account met minimale implementatie
  function createMockAccount(domains: Domain[]): Account {
    return {
      getDomains: () => domains,
    } as unknown as Account;
  }

  // Helper: mock IAccountCatalog met gegeven accounts
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

  it("detects overlap when domain periods overlap with same domain name", () => {
    // Arrange
    const domainName = "example.com";

    const existingDomain = createMockDomain(
      domainName,
      new Date("2025-01-01"),
      new Date("2025-01-31")
    );
    const newDomain = createMockDomain(
      domainName,
      new Date("2025-01-15"),
      new Date("2025-02-15")
    );

    const existingAccount = createMockAccount([existingDomain]);
    const accountCatalog = createMockAccountCatalog([existingAccount]);
    const checker = new DomainPeriodOverlapCheck(accountCatalog);

    // Act
    const result: Result = checker.checkDomainUpdate(newDomain, newDomain.getStartDate(), newDomain.getEndDate());

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("overlapping");
  });

  it("does not detect overlap when domain periods do not overlap", () => {
    // Arrange
    const domainName = "example.com";

    const existingDomain = createMockDomain(
      domainName,
      new Date("2025-01-01"),
      new Date("2025-01-10")
    );
    const newDomain = createMockDomain(
      domainName,
      new Date("2025-01-11"),
      new Date("2025-01-20")
    );

    const existingAccount = createMockAccount([existingDomain]);
    const accountCatalog = createMockAccountCatalog([existingAccount]);
    const checker = new DomainPeriodOverlapCheck(accountCatalog);

    // Act
    const result: Result = checker.checkDomainUpdate(newDomain, newDomain.getStartDate(), newDomain.getEndDate());

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("No overlap");
  });

  it("does not detect overlap when domain names differ", () => {
    // Arrange
    const existingDomain = createMockDomain(
      "example.com",
      new Date("2025-01-01"),
      new Date("2025-01-31")
    );
    const newDomain = createMockDomain(
      "otherdomain.com",
      new Date("2025-01-15"),
      new Date("2025-02-15")
    );

    const existingAccount = createMockAccount([existingDomain]);
    const accountCatalog = createMockAccountCatalog([existingAccount]);
    const checker = new DomainPeriodOverlapCheck(accountCatalog);

    // Act
    const result: Result = checker.checkDomainUpdate(newDomain, newDomain.getStartDate(), newDomain.getEndDate());

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("No overlap");
  });

  it("ignores the current domain itself when checking for overlap", () => {
    // Arrange
    const domainName = "example.com";

    const currentDomain = createMockDomain(
      domainName,
      new Date("2025-01-01"),
      new Date("2025-01-31")
    );

    const existingAccount = createMockAccount([currentDomain]);
    const accountCatalog = createMockAccountCatalog([existingAccount]);
    const checker = new DomainPeriodOverlapCheck(accountCatalog);

    // Act
    const result: Result = checker.checkDomainUpdate(currentDomain, currentDomain.getStartDate(), currentDomain.getEndDate());

    // Assert: should be no overlap with itself
    expect(result.success).toBe(true);
    expect(result.message).toContain("No overlap");
  });
});
