import GenderConverter from "../domain/GenderConverter";
import Gender from "../domain/Gender";

describe("GenderConverter", () => {
  // Arrange: geen speciale voorbereiding nodig, methodes zijn statisch

  describe("fromString", () => {
    it("should convert 'male' and 'm' to Gender.Male", () => {
      // Act
      const result1 = GenderConverter.fromString("male");
      const result2 = GenderConverter.fromString("m");
      const result3 = GenderConverter.fromString("MALE"); // hoofdletters check

      // Assert
      expect(result1).toBe(Gender.Male);
      expect(result2).toBe(Gender.Male);
      expect(result3).toBe(Gender.Male);
    });

    it("should convert 'female' and 'f' to Gender.Female", () => {
      // Act
      const result1 = GenderConverter.fromString("female");
      const result2 = GenderConverter.fromString("f");
      const result3 = GenderConverter.fromString("FEMALE"); // hoofdletters check

      // Assert
      expect(result1).toBe(Gender.Female);
      expect(result2).toBe(Gender.Female);
      expect(result3).toBe(Gender.Female);
    });

    it("should default to Gender.Male for unknown input", () => {
      // Spy on console.warn to verify warning is called
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // Act
      const result = GenderConverter.fromString("unknown");

      // Assert
      expect(result).toBe(Gender.Male);
      expect(warnSpy).toHaveBeenCalledWith('Unknown gender "unknown", defaulting to Gender.Male');

      // Restore the spy
      warnSpy.mockRestore();
    });

    it("should default to Gender.Male if input is empty or undefined", () => {
      // Spy on console.warn
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      // Act
      const result1 = GenderConverter.fromString("");
      const result2 = GenderConverter.fromString(undefined as unknown as string);

      // Assert
      expect(result1).toBe(Gender.Male);
      expect(result2).toBe(Gender.Male);
      expect(warnSpy).toHaveBeenCalledTimes(2);

      // Restore the spy
      warnSpy.mockRestore();
    });
  });

  describe("toString", () => {
    it("should return string representation of Gender enum", () => {
      // Act
      const maleString = GenderConverter.toString(Gender.Male);
      const femaleString = GenderConverter.toString(Gender.Female);

      // Assert
      expect(maleString).toBe(Gender.Male.toString());
      expect(femaleString).toBe(Gender.Female.toString());
    });
  });
});
