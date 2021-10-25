/**
 * User's input
 */
export default interface UserInput {}

/**
 * Type of user input for account creation
 */
export class AccountCreationUserInput implements UserInput {
  private activeCard: boolean;
  private availableLimit: number;

  constructor(accountCreation: {
    activeCard: boolean;
    availableLimit: number;
  }) {
    this.activeCard = accountCreation.activeCard;
    this.availableLimit = accountCreation.availableLimit;
  }

  /**
   * Get user input active card value
   * @returns Transaction user input active card
   */
  public getActiveCard() {
    return this.activeCard;
  }

  /**
   * Get user input available limit
   * @returns Transaction user input available limit
   */
  public getAvailableLimit() {
    return this.availableLimit;
  }
}

/**
 * Type of user input for transaction
 */
export class TransactionUserInput implements UserInput {
  private merchant: string;
  private amount: number;
  private time: Date;

  constructor(transaction: { merchant: string; amount: number; time: string }) {
    this.merchant = transaction.merchant;
    this.amount = transaction.amount;
    this.time = new Date(transaction.time);
  }

  /**
   * Get user input amount
   * @returns Transaction user input amount
   */
  public getAmount(): number {
    return this.amount;
  }

  /**
   * Get user input datetime in milliseconds
   * @returns Transaction user input datetime in milliseconds
   */
  public getTimeInMilliseconds(): number {
    return this.time.getTime();
  }

  /**
   * Get user input merchant
   * @returns Transaction user input merchant
   */
  public getMerchant(): string {
    return this.merchant;
  }
}
