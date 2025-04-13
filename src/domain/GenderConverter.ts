import Gender from "./Gender";

export class GenderConverter {
  static fromString(value: string): Gender {
    switch ((value || '').toLowerCase()) {
      case 'male':
      case 'm':
        return Gender.Male;
      case 'female':
      case 'f':
        return Gender.Female;
      default:
        console.warn(`Unknown gender "${value}", defaulting to Gender.Male`);
        return Gender.Male;
    }
  }

  static toString(gender: Gender): string {
    return gender.toString();
  }
}

export default GenderConverter;