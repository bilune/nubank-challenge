import Violation from "./violation";
import Validation from "./validation";
import Account from "../account";

class DoubledTransactionViolation implements Violation {
  violationName = "doubled-transaction";
}

export default class DoubledTransactionValidation implements Validation {
  private violation = new DoubledTransactionViolation();
  private interval: number;

  constructor(interval: number) {
    this.interval = interval;
  }

  public validate(account: Account, transaction: any): boolean {
    const transactions = account.getTransactions();

    const minTime = transaction.time.getTime() - this.interval;

    for (let i = transactions.length - 1; i >= 0; i--) {
      const currentTransaction = transactions[i];
      if (
        minTime < currentTransaction.time.getTime() &&
        currentTransaction.merchant === transaction.merchant && 
        currentTransaction.amount === transaction.amount
      ) {
        return false;
      }
    }

    return true;
  }

  public getViolation(): Violation {
    return this.violation;
  }
}
