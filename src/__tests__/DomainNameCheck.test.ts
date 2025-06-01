import DomainNameCheck from "../domain/DomainNameCheck";
import Domain from "../domain/Domain";
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";
import Account from "../domain/Account";

describe("DomainNameCheck", () => {
  // Helper om mock Domain te maken met naam en start/eind datum
  function createMockDomain(name: string, startDate: Date, endDate: Date): Domain {
    return {
      getDomainName: () => name,
      getStartDate: () => startDate,
      getEndDate: () => endDate,
    } as unknown as Domain;
  }

  // Helper om mock Account te maken met lijst van domains
  function createMockAccount(domains: Domain[]): Account {
    return {
      getDomains: () => domains,
    } as unknown as Account;
  }

  // Mock IAccountCatalog met accounts
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

  it("should fail if domain name and period overlap with existing domain", () => {
    // Arrange
    const domainName = "example.com";

    const existingDomain = createMockDomain(
      domainName,
      new Date("2025-01-01T00:00:00Z"),
      new Date("2025-02-01T00:00:00Z")
    );

    const newDomainOverlap = createMockDomain(
      domainName,
      new Date("2025-01-15T00:00:00Z"),
      new Date("2025-02-15T00:00:00Z")
    );

    const existingAccount = createMockAccount([existingDomain]);

    const mockAccountCatalog = createMockAccountCatalog([existingAccount]);

    const checker = new DomainNameCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomain(newDomainOverlap, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("already associated with an existing account");
  });

  it("should succeed if domain name is same but periods do not overlap", () => {
    // Arrange
    const domainName = "example.com";

    const existingDomain = createMockDomain(
      domainName,
      new Date("2025-01-01T00:00:00Z"),
      new Date("2025-01-15T00:00:00Z")
    );

    const newDomainNoOverlap = createMockDomain(
      domainName,
      new Date("2025-01-16T00:00:00Z"),
      new Date("2025-02-01T00:00:00Z")
    );

    const existingAccount = createMockAccount([existingDomain]);
    const mockAccountCatalog = createMockAccountCatalog([existingAccount]);

    const checker = new DomainNameCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomain(newDomainNoOverlap, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("unique");
  });

  it("should succeed if domain names are different even if periods overlap", () => {
    // Arrange
    const existingDomain = createMockDomain(
      "example.com",
      new Date("2025-01-01T00:00:00Z"),
      new Date("2025-02-01T00:00:00Z")
    );

    const newDomainDifferentName = createMockDomain(
      "otherdomain.com",
      new Date("2025-01-15T00:00:00Z"),
      new Date("2025-02-15T00:00:00Z")
    );

    const existingAccount = createMockAccount([existingDomain]);
    const mockAccountCatalog = createMockAccountCatalog([existingAccount]);

    const checker = new DomainNameCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomain(newDomainDifferentName, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("unique");
  });
});
