import Account from './Account';
import Result from './Result';

function CheckPassword(oldPassword: string, newPassword: string, account: Account): Result {
    if (oldPassword !== account.getPassword()) {
        return new Result(false, "Oude wachtwoord is incorrect.");
    }

    if (newPassword === oldPassword) {
        return new Result(false, "Nieuwe wachtwoord mag niet hetzelfde zijn als het oude.");
    }

    return new Result(true, "Wachtwoorden komen overeen.");
}

export default CheckPassword;
