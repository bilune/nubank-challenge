import Authorizer from "./authorizer";
import Operation from "./operation";
import Violation from "./validation/violation";

export default class Account {
  private initialized = false;
  private activeCard: boolean = false;
  private availableLimit: number = 0;
  private transactionsAuthorizer: Authorizer | null = null;
  private accountAuthorizer: Authorizer | null = null;
  private transactions: any[] = [];

  public getActiveCard(): boolean {
    return this.activeCard;
  }

  public getAvailableLimit(): number {
    return this.availableLimit;
  }

  public init(activeCard: boolean, availableLimit: number): Operation {
    const violations = this.validate(this.accountAuthorizer, {
      activeCard,
      availableLimit,
    });

    if (violations.length === 0) {
      this.initialized = true;
      this.activeCard = activeCard;
      this.availableLimit = availableLimit;
    }

    const operation = new Operation(this);
    operation.addViolation(...violations);

    return operation;
  }

  public process(merchant: string, amount: number, time: Date): Operation {
    const violations = this.validate(this.transactionsAuthorizer, {
      merchant,
      amount,
      time,
    });
    if (violations.length === 0) {
      this.availableLimit = this.availableLimit - amount;
      this.transactions.push({ merchant, amount, time });
    }

    const operation = new Operation(this);
    operation.addViolation(...violations);

    return operation;
  }

  private validate(
    authorizer: Authorizer | null,
    transaction: any
  ): Violation[] {
    if (!authorizer) return [];

    const violations = authorizer.validate(this, transaction);

    return violations;
  }

  public setAccountAuthorizer(authorizer: Authorizer) {
    this.accountAuthorizer = authorizer;
  }

  public setTransactionAuthorizer(authorizer: Authorizer) {
    this.transactionsAuthorizer = authorizer;
  }

  public wasInitialized(): boolean {
    return this.initialized;
  }

  public getTransactions(): any[] {
    return this.transactions;
  }
}
