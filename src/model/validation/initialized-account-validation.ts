import Violation from "src/model/validation/violation";
import Validation from "src/model/validation/validation";
import Account from "src/model/account";

class AccountNotInitializedViolation implements Violation {
  violationName = "account-not-initialized";
}

/**
 * No transaction should be accepted without a properly initialized account: account-not-initialized
 */
export default class InitializedAccountValidation extends Validation {
  constructor() {
    const violation = new AccountNotInitializedViolation();
    super(violation);
  }

  /**
   * Checks whether the account was initialized.
   * @param account Current account
   * @returns A boolean indicating if it was already initialized
   */
  public validate(account: Account): boolean {
    return account.wasInitialized();
  }
}
