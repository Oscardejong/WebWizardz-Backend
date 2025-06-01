import AccountUsernameCheck from "../domain/AccountUsernameCheck";
import Account from "../domain/Account";
import Customer from "../domain/Customer";
import Result from "../domain/Result";
import IAccountCatalog from "../domain/IAccountCatalog";

describe("AccountUsernameCheck", () => {
  const mockAccountUsername = "user123";

  // Mock Account met getUsername()
  const mockAccount = {
    getUsername: jest.fn(() => mockAccountUsername),
  } as unknown as Account;

  const mockCustomer = {} as Customer;

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

  it("should return failure Result if username already exists", () => {
    // Arrange
    const existingAccount = {
      getUsername: () => mockAccountUsername,
    } as Account;
    const mockAccountCatalog = createMockAccountCatalog([existingAccount]);
    const checker = new AccountUsernameCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkAccountAndUser(
      mockAccount,
      mockCustomer,
      mockAccountCatalog,
      {} as any
    );

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("already associated");
  });

  

  it("should return success Result if username is unique", () => {
    // Arrange
    const otherAccount = {
      getUsername: () => "otherUser",
    } as Account;
    const mockAccountCatalog = createMockAccountCatalog([otherAccount]);
    const checker = new AccountUsernameCheck(mockAccountCatalog);

    // Act
    const result: Result = checker.checkAccountAndUser(
      mockAccount,
      mockCustomer,
      mockAccountCatalog,
      {} as any
    );

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toContain("unique");
  });
});
