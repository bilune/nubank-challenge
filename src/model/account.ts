import Authorizer from "src/model/authorizer";
import Operation from "src/model/operation";
import { AccountCreationUserInput, TransactionUserInput } from "src/model/user-input";

/**
 * It stores current account state and allows its modification through init and process methods.
 */
export default class Account {
  private initialized = false;
  private activeCard: boolean = false;
  private availableLimit: number = 0;
  private transactionsAuthorizer = new Authorizer();
  private accountAuthorizer = new Authorizer();
  private transactions: TransactionUserInput[] = [];

  /**
   *
   * @param accountCreationData
   * @returns
   */
  public init(accountCreationData: {
    activeCard: boolean;
    availableLimit: number;
  }): Operation {
    const accountCreation = new AccountCreationUserInput(accountCreationData);
    const violations = this.accountAuthorizer.validate(this, accountCreation);

    if (violations.length === 0) {
      this.applyAccountCreation(accountCreation);
    }

    const operation = new Operation(this);
    operation.addViolation(...violations);

    return operation;
  }

  /**
   * It initialize the account and set initial card and limit states.
   * @param userInput A valid account creation user input
   */
  private applyAccountCreation(userInput: AccountCreationUserInput): void {
    this.initialized = true;
    this.activeCard = userInput.getActiveCard();
    this.availableLimit = userInput.getAvailableLimit();
  }

  /**
   * Method to process a transaction in the context of the current account state.
   * It validates the input and apply the transaction if it is valid.
   * @param transactionData User's input. It must have a merchant, an amount and a time.
   * @returns A valid or invalid operation.
   */
  public process(transactionData: {
    merchant: string;
    amount: number;
    time: string;
  }): Operation {
    const transaction = new TransactionUserInput(transactionData);
    const violations = this.transactionsAuthorizer.validate(this, transaction);

    if (violations.length === 0) {
      this.applyTransaction(transaction);
    }

    const operation = new Operation(this);
    operation.addViolation(...violations);

    return operation;
  }

  /**
   * It adds the transaction to the list and updates account's amount.
   * @param userInput A valid transaction user input
   */
  private applyTransaction(userInput: TransactionUserInput): void {
    this.availableLimit = this.availableLimit - userInput.getAmount();
    this.transactions.push(userInput);
  }

  /**
   * Get account's card state.
   * @returns Whether the current account's card is active
   */
  public getActiveCard(): boolean {
    return this.activeCard;
  }

  /**
   * Get account's current available limit.
   * @returns The current available limit
   */
  public getAvailableLimit(): number {
    return this.availableLimit;
  }

  /**
   * Get account's validated transactions history.
   * @returns A list of valid transactions
   */
  public getTransactions(): TransactionUserInput[] {
    return this.transactions;
  }

  /**
   * Get account's initialized state
   * @returns Whether the account was initialized
   */
  public wasInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Set an authorizer for account creation validation
   * @param authorizer An authorizer class with custom validations.
   */
  public setAccountAuthorizer(authorizer: Authorizer): void {
    this.accountAuthorizer = authorizer;
  }

  /**
   * Set an authorizer for transaction validation
   * @param authorizer An authorizer class with custom validations.
   */
  public setTransactionAuthorizer(authorizer: Authorizer) {
    this.transactionsAuthorizer = authorizer;
  }
}
