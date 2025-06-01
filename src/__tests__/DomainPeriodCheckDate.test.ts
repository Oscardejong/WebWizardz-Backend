import DomainDateCheck from "../domain/DomainDateCheck";
import Domain from "../domain/Domain";
import Domainstatus from "../domain/Domainstatus";  // <-- importeer enum
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";

describe("DomainDateCheck", () => {
  // Mock IAccountCatalog (wordt niet gebruikt in de check, maar moet mee)
  const mockAccountCatalog = {} as IAccountCatalog;

  it("should fail if start date is in the past", () => {
    // Arrange
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 uur geleden
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 25); // over 25 uur
    const mockDomain = new Domain("testdomain", Domainstatus.ONLINE, pastDate, futureDate);

    const checker = new DomainDateCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomain(mockDomain, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("cannot be earlier than the current date");
  });

  it("should fail if duration is less than 24 hours", () => {
    // Arrange
    const startDate = new Date(Date.now() + 1000 * 60 * 60); // over 1 uur vanaf nu
    const lessThan24hLater = new Date(startDate.getTime() + 1000 * 60 * 60 * 23); // 23 uur later
    const mockDomain = new Domain("testdomain", Domainstatus.ONLINE, startDate, lessThan24hLater);

    const checker = new DomainDateCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomain(mockDomain, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("at least 24 hours");
  });

  it("should succeed if start date is valid and duration is at least 24 hours", () => {
    // Arrange
    const startDate = new Date(Date.now() + 1000 * 60 * 60); // over 1 uur vanaf nu
    const atLeast24hLater = new Date(startDate.getTime() + 1000 * 60 * 60 * 26); // 26 uur later
    const mockDomain = new Domain("testdomain", Domainstatus.ONLINE, startDate, atLeast24hLater);

    const checker = new DomainDateCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkDomain(mockDomain, mockAccountCatalog);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("Domain date is valid");
  });
});
