import Account from "../model/account";
import Authorizer from "../model/authorizer";
import Operation from "../model/operation";
import AccountUniquenessValidation from "../model/validation/account-uniqueness-validation";
import ActiveCardValidation from "../model/validation/active-card-validation";
import DoubledTransactionValidation from "../model/validation/doubled-transaction-validation";
import InitializedAccountValidation from "../model/validation/initialized-account-validation";
import SufficientLimitValidation from "../model/validation/sufficient-limit-validation";
import TransactionFrequencyValidation from "../model/validation/transaction-frequency-validation";
import Controller from "../types/controller";
import CommandLineView from "../view/command-line";

export default class AccountController implements Controller {
  private account: Account;
  private view: CommandLineView;

  constructor(model: Account, view: CommandLineView) {
    this.account = model;
    this.view = view;
  }

  public execute(): Promise<void> {
    const accountAuthorizer = new Authorizer();
    accountAuthorizer.addValidation(new AccountUniquenessValidation());

    this.account.setAccountAuthorizer(accountAuthorizer);

    const transactionAuthorizer = new Authorizer();
    transactionAuthorizer.addValidation(new InitializedAccountValidation());
    transactionAuthorizer.addValidation(new SufficientLimitValidation());
    transactionAuthorizer.addValidation(new ActiveCardValidation());
    transactionAuthorizer.addValidation(
      new TransactionFrequencyValidation(3, 60 * 2 * 1000)
    );
    transactionAuthorizer.addValidation(new DoubledTransactionValidation(60 * 2 * 1000));

    this.account.setTransactionAuthorizer(transactionAuthorizer);

    return this.view.addListener(this);
  }

  public dispatch(data: Record<string, any>): void {
    let operation: Operation;
    if ("account" in data) {
      operation = this.account.init(
        data.account["active-card"],
        data.account["available-limit"]
      );
    } else if ("transaction" in data) {
      operation = this.account.process(
        data.transaction["merchant"],
        data.transaction["amount"],
        new Date(data.transaction["time"])
      );
    } else {
      return;
    }

    this.view.modelUpdated(operation.toSource());
  }
}
