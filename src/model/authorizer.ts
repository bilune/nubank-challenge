import Account from "./account";
import Validation from "./validation/validation";
import Violation from "./validation/violation";

export default class Authorizer {
  private validations: Validation[] = [];

  public addValidation(validation: Validation) {
    this.validations.push(validation);
  }

  public validate(account: Account, transaction: any): Violation[] {
    return this.validations.reduce<Violation[]>((prev, validation) => {
      if (validation.validate(account, transaction)) {
        return prev;
      }
      return [...prev, validation.getViolation()];
    }, []);
  }
}
