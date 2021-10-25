import Violation from "src/model/validation/violation";
import Validation from "src/model/validation/validation";
import Account from "src/model/account";

class CardNotActiveViolation implements Violation {
  violationName = "card-not-active";
}

/**
 * No transaction should be accepted when the card is not active: card-not-active
 */
export default class ActiveCardValidation extends Validation {
  constructor() {
    const violation = new CardNotActiveViolation();
    super(violation);
  }

  /**
   * Checks if the user has an active card.
   * @param account Current account
   * @returns Whether the operation is valid
   */
  public validate(account: Account): boolean {
    // It needs the user to have already initialized the account.
    if (!account.wasInitialized()) return true;
    return account.getActiveCard();
  }
}
