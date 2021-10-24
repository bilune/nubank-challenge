import Violation from "./violation";
import Validation from "./validation";
import Account from "../account";

class AccountNotInitializedViolation implements Violation {
  violationName = "account-not-initialized";
}

export default class InitializedAccountValidation implements Validation {
  private violation = new AccountNotInitializedViolation();

  public validate(account: Account): boolean {
    return account.wasInitialized();
  }

  public getViolation(): Violation {
    return this.violation;
  }
}
