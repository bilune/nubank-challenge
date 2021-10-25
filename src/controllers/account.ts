import Account from "src/model/account";
import Authorizer from "src/model/authorizer";
import Operation from "src/model/operation";
import AccountUniquenessValidation from "src/model/validation/account-uniqueness-validation";
import ActiveCardValidation from "src/model/validation/active-card-validation";
import DoubledTransactionValidation from "src/model/validation/doubled-transaction-validation";
import InitializedAccountValidation from "src/model/validation/initialized-account-validation";
import SufficientLimitValidation from "src/model/validation/sufficient-limit-validation";
import TransactionFrequencyValidation from "src/model/validation/transaction-frequency-validation";
import Controller from "src/types/controller";
import CommandLineView from "src/view/command-line";

/**
 * Account controller
 */
export default class AccountController implements Controller {
  private account: Account;
  private view: CommandLineView;

  constructor(model: Account, view: CommandLineView) {
    this.account = model;
    this.view = view;
  }

  /**
   * It starts the execution of the program.
   */
  public execute(): Promise<void> {
    /**
     * Account authorizer
     */
    const accountAuthorizer = new Authorizer();
    accountAuthorizer.addValidation(new AccountUniquenessValidation());

    this.account.setAccountAuthorizer(accountAuthorizer);

    /**
     * Transaction authorizer
     */
    const transactionAuthorizer = new Authorizer();
    transactionAuthorizer.addValidation(new InitializedAccountValidation());
    transactionAuthorizer.addValidation(new SufficientLimitValidation());
    transactionAuthorizer.addValidation(new ActiveCardValidation());
    transactionAuthorizer.addValidation(
      new TransactionFrequencyValidation(3, 60 * 2 * 1000)
    );
    transactionAuthorizer.addValidation(
      new DoubledTransactionValidation(60 * 2 * 1000)
    );

    this.account.setTransactionAuthorizer(transactionAuthorizer);

    // It waits until the view sends an user input.
    return this.view.addListener(this);
  }

  /**
   * It receives an user input and try to authorize the operation.
   * @param data 
   * @returns 
   */
  public dispatch(data: Record<string, any>): void {
    let operation: Operation;
    if ("account" in data) {
      const { "active-card": activeCard, "available-limit": availableLimit } =
        data.account;
      operation = this.account.init({ activeCard, availableLimit });
    } else if ("transaction" in data) {
      operation = this.account.process(data.transaction);
    } else {
      return;
    }

    // Once the operation is created, it is send to the view to be presented to the user.
    this.view.modelUpdated(operation.toSource());
  }
}
