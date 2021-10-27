import Account from "../account";
import Violation from "./violation";
import Validation from "./validation";

class AccountAlreadyCreatedViolation implements Violation {
  violationName = "account-already-initialized";
}

/**
 * Once created, the account should not be updated or recreated. If the application receives another
 * account creation operation, it should return the following violation: account-already-initialized.
 */
export default class AccountUniquenessValidation extends Validation {
  constructor() {
    const violation = new AccountAlreadyCreatedViolation();
    super(violation);
  }

  /**
   * It prevents the user to initialize an already initialized account.
   * @param account Current account
   * @returns Whether the operation is valid
   */
  public validate(account: Account): boolean {
    return !account.wasInitialized();
  }
}
