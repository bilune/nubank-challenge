import Account from "../account";
import Violation from "./violation";

export default interface Validation {
  validate(account: Account, transaction: any): boolean;
  getViolation(): Violation;
}
