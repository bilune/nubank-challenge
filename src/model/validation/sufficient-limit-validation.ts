import Violation from "./violation";
import Validation from "./validation";
import Account from "../account";

class InsufficientLimitViolation implements Violation {
  violationName = "insufficient-limit";
}

export default class SufficientLimitValidation implements Validation {
  private violation = new InsufficientLimitViolation();

  public validate(account: Account, transaction: any): boolean {
    if (!account.wasInitialized()) return true;

    const availableLimit = account.getAvailableLimit();

    return availableLimit - transaction.amount >= 0;
  }

  public getViolation(): Violation {
    return this.violation;
  }
}

