import Account from './Account';
import Result from './Result';

function CheckPassword(password: string): Result {
  if (!password || password.length < 8) {
    return new Result(false, "Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
    return new Result(false, "Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
    return new Result(false, "Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
    return new Result(false, "Password must contain at least one digit.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return new Result(false, "Password must contain at least one special character.");
    }
    

    return new Result(true, "Password is valid.");
}

export default CheckPassword;
