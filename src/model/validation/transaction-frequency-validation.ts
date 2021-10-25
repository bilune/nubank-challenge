import Account from "src/model/account";
import { TransactionUserInput } from "src/model/user-input";
import Violation from "src/model/validation/violation";
import Validation from "src/model/validation/validation";

class HighFrequencySmallIntervalViolation implements Violation {
  violationName = "high-frequency-small-interval";
}

/**
 * There should be no more than 3 transactions within a 2 minutes interval: high-frequency-smallinterval
 */
export default class TransactionFrequencyValidation extends Validation {
  private frequency: number;
  private interval: number;

  /**
   * Initialize the validation
   * @param frequency Amount of transactions considered in the period of time.
   * @param interval Needed time elapsed between transactions in milliseconds.
   */
  constructor(frequency: number, interval: number) {
    const violation = new HighFrequencySmallIntervalViolation();
    super(violation);
    this.frequency = frequency;
    this.interval = interval;
  }

  /**
   * It compares the time elapsed between the current transaction and the
   * nth last transaction with a certain amount of time.
   * If the time elapsed is lower thant the needed interval, it
   * adds a high frequency in small period of time violation.
   * @param account Current account
   * @param transaction Current user input transaction being validated
   * @returns Whether the operation is valid
   */
  public validate(
    account: Account,
    transaction: TransactionUserInput
  ): boolean {
    const transactions = account.getTransactions();

    const thirdLastTransaction =
      transactions[transactions.length - this.frequency];

    // It there are no enough previous transactions, it is considered valid.
    if (!thirdLastTransaction) return true;

    const timeElapsedBetweenTransactions =
      transaction.getTimeInMilliseconds() -
      thirdLastTransaction.getTimeInMilliseconds();

    // It must be greater thant he minimum interval.
    return timeElapsedBetweenTransactions >= this.interval;
  }
}
