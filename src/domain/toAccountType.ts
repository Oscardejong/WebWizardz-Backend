import AccountType from './AccountType';

function toAccountType(type: string): AccountType {
  switch (type.toLowerCase()) {
    case 'admin':
      return AccountType.Admin;
    case 'user':
      return AccountType.User;
    default:
      throw new Error(`Unknown AccountType: ${type}`);
  }
}

export default toAccountType;
