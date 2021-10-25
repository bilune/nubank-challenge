import Account from "src/model/account";
import UserInput from "src/model/user-input";
import Violation from "src/model/validation/violation";

/**
 * Validation base class. It stores a related violation that is added to the
 * output operation in case the validate method returns false.
 */
export default abstract class Validation {
  private violation: Violation;

  constructor(violation: Violation) {
    this.violation = violation;
  }

  abstract validate(account: Account, input: UserInput): boolean;

  /**
   * 
   * @returns Validation violation
   */
  getViolation(): Violation {
    return this.violation;
  };
}
