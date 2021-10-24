import Violation from "./violation";
import Validation from "./validation";
import Account from "../account";

class CardNotActiveViolation implements Violation {
  violationName = "card-not-active";
}

export default class ActiveCardValidation implements Validation {
  private violation = new CardNotActiveViolation();

  public validate(account: Account): boolean {
    if (!account.wasInitialized()) return true;
    return account.getActiveCard();
  }

  public getViolation(): Violation {
    return this.violation;
  }
}
