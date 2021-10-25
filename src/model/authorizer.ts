import Account from "src/model/account";
import UserInput from "src/model/user-input";
import Validation from "src/model/validation/validation";
import Violation from "src/model/validation/violation";

/**
 * Class to store validations to be applied to a certain type of user's input.
 */
export default class Authorizer {
  private validations: Validation[] = [];

  /**
   * Add a custom validation to the authorizer. Then, the list of validations
   * is iterated by `validate` method to find violations. 
   * @param validation 
   */
  public addValidation(validation: Validation): void {
    this.validations.push(validation);
  }

  /**
   * Validate a received input.
   * If the list of returned violations is empty the operation can be considered valid.
   * @param authorizer An authorizer with custom validations
   * @param input User's input
   * @returns A list of violations
   */
  public validate(account: Account, input: UserInput): Violation[] {
    return this.validations.reduce<Violation[]>((prev, validation) => {
      if (validation.validate(account, input)) {
        // If it is valid, no violation is added to the array.
        return prev;
      }
      // Otherwise, the violation is added.
      return [...prev, validation.getViolation()];
    }, []);
  }
}
