import CustomerEmailCheck from "../domain/CustomerEmailCheck";
import Account from "../domain/Account";
import Customer from "../domain/Customer";
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";
import ICustomerCatalog from "../domain/ICustomerCatalog";

describe("CustomerEmailCheck", () => {
  const mockEmail = "test@example.com";

  // Mock Customer met getEmail()
  const mockCustomer = {
    getEmail: jest.fn(() => mockEmail),
  } as unknown as Customer;

  // Mock Account (niet gebruikt in check, maar vereist als parameter)
  const mockAccount = {} as Account;

  // Helper functie om een volledige mock van ICustomerCatalog te maken
  function createMockCustomerCatalog(customers: Customer[]): ICustomerCatalog {
    return {
      getCustomers: () => customers,
      addCustomer: jest.fn(),
      updateCustomer: jest.fn(),
      clear: jest.fn(),
      deleteCustomerByEmail: jest.fn(),
      getCustomerByEmail: jest.fn(),
    };
  }

  it("should return failure Result if email already exists", () => {
    // Arrange
    const existingCustomer = {
      getEmail: () => mockEmail,
    } as Customer;
    const mockCustomerCatalog = createMockCustomerCatalog([existingCustomer]);
    const checker = new CustomerEmailCheck(mockCustomerCatalog);

    // Act
    const result: Result = checker.checkAccountAndUser(
      mockAccount,
      mockCustomer,
      {} as IAccountCatalog,
      mockCustomerCatalog
    );

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("already associated");
  });

  it("should return success Result if email is unique", () => {
    // Arrange
    const otherCustomer = {
      getEmail: () => "unique@example.com",
    } as Customer;
    const mockCustomerCatalog = createMockCustomerCatalog([otherCustomer]);
    const checker = new CustomerEmailCheck(mockCustomerCatalog);

    // Act
    const result: Result = checker.checkAccountAndUser(
      mockAccount,
      mockCustomer,
      {} as IAccountCatalog,
      mockCustomerCatalog
    );

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("unique");
  });
});
