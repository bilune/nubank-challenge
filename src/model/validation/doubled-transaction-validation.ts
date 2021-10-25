import Account from "src/model/account";
import Violation from "src/model/validation/violation";
import Validation from "src/model/validation/validation";
import { TransactionUserInput } from "src/model/user-input";

class DoubledTransactionViolation implements Violation {
  violationName = "doubled-transaction";
}

/**
 * There should be no more than 1 similar transaction (same amount and merchant) within a 2 minutes
 * interval: doubled-transaction
 */
export default class DoubledTransactionValidation extends Validation {
  private interval: number;

  constructor(interval: number) {
    const violation = new DoubledTransactionViolation();
    super(violation);
    this.interval = interval;
  }

  /**
   * Look for repeated transactions in a certain period of time.
   * @param account Current account
   * @param transaction Current user input transaction being validated
   * @returns Whether the operation is valid
   */
  public validate(
    account: Account,
    transaction: TransactionUserInput
  ): boolean {
    const transactions = account.getTransactions();

    // Calculates the initial time from wich we will look for a repeated movement
    const minTime = transaction.getTimeInMilliseconds() - this.interval;

    // Iterates the transaction in revert order, beginning with the last one
    for (let i = transactions.length - 1; i >= 0; i--) {
      const currentTransaction = transactions[i];
      // If the movement was added before that initial time
      if (minTime >= currentTransaction.getTimeInMilliseconds()) {
        // Then there are no movements to compare in that period of time
        // so the transaction is valid
        return true;
      }

      if (
        // The movement was added after that initial time
        // and has the same merchant and amount
        currentTransaction.getMerchant() === transaction.getMerchant() &&
        currentTransaction.getAmount() === transaction.getAmount()
      ) {
        // then, the transaction is considered duplicated.
        return false;
      }
    }

    return true;
  }
}
