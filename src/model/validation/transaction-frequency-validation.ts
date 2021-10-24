import Violation from "./violation";
import Validation from "./validation";
import Account from "../account";

class HighFrequencySmallIntervalViolation implements Violation {
  violationName = "high-frequency-small-interval";
}

export default class TransactionFrequencyValidation implements Validation {
  private violation = new HighFrequencySmallIntervalViolation();
  private frequency: number;
  private interval: number;

  constructor(frequency: number, interval: number) {
    this.frequency = frequency;
    this.interval = interval;
  }

  public validate(account: Account, transaction: any): boolean {
    const transactions = account.getTransactions();

    const thirdLastTransaction =
      transactions[transactions.length - this.frequency];

    if (!transaction || !thirdLastTransaction) {
      return true;
    }

    return (
      transaction.time.getTime() - thirdLastTransaction.time.getTime() >=
      this.interval
    );
  }

  public getViolation(): Violation {
    return this.violation;
  }
}
