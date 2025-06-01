import DomainPeriodCheckStatus from "../domain/DomainPeriodCheckStatus";
import Domain from "../domain/Domain";
import Result from "../domain/Result";
import DomainStatus from "../domain/Domainstatus";
import IAccountCatalog from "../domain/IAccountCatalog";

describe("DomainPeriodCheckStatus", () => {
  // Mock Domain met alleen getDomainstatus
  function createMockDomain(status: DomainStatus): Domain {
    return {
      getDomainstatus: () => status,
    } as unknown as Domain;
  }

  // Mock IAccountCatalog, niet gebruikt in deze test maar vereist door constructor
  const mockAccountCatalog: IAccountCatalog = {
    getAccounts: () => [],
    addAccount: jest.fn(),
    updateAccount: jest.fn(),
    clear: jest.fn(),
    deleteAccountByUsername: jest.fn(),
    getAccountByUsername: jest.fn(),
  };

  it("should fail update if domain status is ONLINE", () => {
    // Arrange
    const domain = createMockDomain(DomainStatus.ONLINE);
    const checker = new DomainPeriodCheckStatus(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomainUpdate(domain, new Date(), new Date());

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Cannot update period for a domain with status ONLINE.");
  });

  it("should allow update if domain status is not ONLINE", () => {
    // Arrange
    const domain = createMockDomain(DomainStatus.OFFLINE); // Bijvoorbeeld OFFLINE
    const checker = new DomainPeriodCheckStatus(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomainUpdate(domain, new Date(), new Date());

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe("Domain status is valid for period update.");
  });
});
