import Account from "../account";
import Violation from "./violation";
import Validation from "./validation";

class AccountAlreadyCreatedViolation implements Violation {
  violationName = "account-already-initialized";
}

export default class AccountUniquenessValidation implements Validation {
  private violation = new AccountAlreadyCreatedViolation();

  public validate(account: Account): boolean {
    return !account.wasInitialized();
  }

  public getViolation(): Violation {
    return this.violation;
  }
}