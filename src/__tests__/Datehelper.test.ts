// dateHelper.test.ts
import { parseDate } from "../domain/DateHelper";

describe('parseDate', () => {
  test('should parse a valid date string correctly', () => {
    // Arrange
    const validDateString = '2023-06-01';

    // Act
    const result = parseDate(validDateString);

    // Assert
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString().startsWith('2023-06-01')).toBe(true);
  });

  test('should throw error for invalid date string', () => {
    // Arrange
    const invalidDateString = 'not-a-date';

    // Act & Assert
    expect(() => parseDate(invalidDateString)).toThrow('Invalid date string');
  });

  test('should throw error for empty string', () => {
    // Arrange
    const emptyDateString = '';

    // Act & Assert
    expect(() => parseDate(emptyDateString)).toThrow('Invalid date string');
  });
});
