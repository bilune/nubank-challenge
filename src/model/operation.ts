import Account from "src/model/account";
import Violation from "src/model/validation/violation";

/**
 * Account's movement that reflects its state in given time.
 */
export default class Operation {
  private initialized: boolean;
  private activeCard: boolean;
  private availableLimit: number;
  private violations: Violation[] = [];

  constructor(account: Account) {
    this.initialized = account.wasInitialized();
    this.activeCard = account.getActiveCard();
    this.availableLimit = account.getAvailableLimit();
  }

  /**
   * It allows to add a violation or multiple ones to the movement
   * @param violations Violations
   */
  public addViolation(...violations: Violation[]) {
    violations.forEach((violation) => {
      this.violations.push(violation);
    });
  }

  /**
   * Method to transform movement data to a visual output
   * @returns account's movement data
   */
  public toSource() {
    let account: { "active-card"?: boolean; "available-limit"?: number } = {};

    if (this.initialized) {
      account = {
        "active-card": this.activeCard,
        "available-limit": this.availableLimit,
      };
    }

    return {
      account,
      violations: this.violations.map((violation) => violation.violationName),
    };
  }
}
