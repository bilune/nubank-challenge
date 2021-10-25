import Account from "src/model/account";
import { TransactionUserInput } from "src/model/user-input";
import Violation from "src/model/validation/violation";
import Validation from "src/model/validation/validation";

class InsufficientLimitViolation implements Violation {
  violationName = "insufficient-limit";
}

/**
 * The transaction amount should not exceed the available limit: insufficient-limit
 */
export default class SufficientLimitValidation extends Validation {
  constructor() {
    const violation = new InsufficientLimitViolation();
    super(violation);
  }

  /**
   * It checks that the account has enough money to accept the operation.
   * @param account Current account
   * @param transaction Current user input transaction being validated
   * @returns Whether the operation is valid
   */
  public validate(account: Account, transaction: TransactionUserInput): boolean {
    // The user needs to initialize the account
    if (!account.wasInitialized()) return true;

    const availableLimit = account.getAvailableLimit();

    // If we substract the desired amount, the account's amount must not turn negative.
    return availableLimit - transaction.getAmount() >= 0;
  }
}
