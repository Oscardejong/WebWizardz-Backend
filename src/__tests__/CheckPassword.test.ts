import CheckPassword from "../domain/CheckPassword";
import Result from "../domain/Result";

describe("CheckPassword", () => {
  it("should fail if password is empty or shorter than 8 chars", () => {
    // Arrange
    const shortPassword = "Ab1!";

    // Act
    const result = CheckPassword(shortPassword);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Password must be at least 8 characters long.");
  });

  it("should fail if password has no uppercase letter", () => {
    // Arrange
    const password = "abcdefg1!";

    // Act
    const result = CheckPassword(password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Password must contain at least one uppercase letter.");
  });

  it("should fail if password has no lowercase letter", () => {
    // Arrange
    const password = "ABCDEFG1!";

    // Act
    const result = CheckPassword(password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Password must contain at least one lowercase letter.");
  });

  it("should fail if password has no digit", () => {
    // Arrange
    const password = "Abcdefgh!";

    // Act
    const result = CheckPassword(password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Password must contain at least one digit.");
  });

  it("should fail if password has no special character", () => {
    // Arrange
    const password = "Abcdefg1";

    // Act
    const result = CheckPassword(password);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Password must contain at least one special character.");
  });

  it("should succeed if password meets all criteria", () => {
    // Arrange
    const validPassword = "Abcdef1!";

    // Act
    const result = CheckPassword(validPassword);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe("Password is valid.");
  });
});