import AgeCalculator from "../domain/AgeCalculator";


describe("AgeCalculator", () => {
  it("should correctly calculate age based on birthdate", () => {
    // Arrang
    const birthdate = new Date(2000, 4, 15); 
    const ageCalculator = new AgeCalculator(birthdate);

    // Act
    const age = ageCalculator.getAge();

    // Assert
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 2000 - (new Date().getMonth() < 4 || (new Date().getMonth() === 4 && new Date().getDate() < 15) ? 1 : 0);
    expect(age).toBe(expectedAge);
  });

  it("should work with birthdate given as string", () => {
    // Arrange
    const birthdateStr = "1990-12-31";
    const ageCalculator = new AgeCalculator(birthdateStr);

    // Act
    const age = ageCalculator.getAge();

    // Assert
    const currentYear = new Date().getFullYear();
    const birthYear = 1990;
    const birthMonth = 11; // december (0-based)
    const birthDay = 31;

    const today = new Date();
    let expectedAge = currentYear - birthYear;
    if (today.getMonth() < birthMonth || (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
      expectedAge--;
    }

    expect(age).toBe(expectedAge);
  });
});
