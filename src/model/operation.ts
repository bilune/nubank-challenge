import Account from "./account";
import Violation from "./validation/violation";

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

  public addViolation(...violations: Violation[]) {
    violations.forEach((violation) => {
      this.violations.push(violation);
    });
  }

  public toSource() {
    let account: Record<string, any> = {
      "active-card": this.activeCard,
      "available-limit": this.availableLimit,
    };

    if (!this.initialized) {
      account = {};
    }

    return {
      account,
      violations: this.violations.map((violation) => violation.violationName),
    };
  }
}
