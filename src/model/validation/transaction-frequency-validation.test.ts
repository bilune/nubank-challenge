import Account from "../account";
import { TransactionUserInput } from "../user-input";
import TransactionFrequencyValidation from "./transaction-frequency-validation";

describe("Transaction frequency validation", () => {
  let account: Account;

  beforeEach(() => {
    // Initialize a new account
    account = new Account();
    account.init({
      activeCard: true,
      availableLimit: 100,
    });

    // Setting up context
    account.process({
      merchant: "Burger King",
      amount: 20,
      time: "2019-02-13T11:00:00.000Z",
    });

    account.process({
      merchant: "Habbib's",
      amount: 20,
      time: "2019-02-13T11:00:01.000Z",
    });

    account.process({
      merchant: "McDonald's",
      amount: 20,
      time: "2019-02-13T11:01:01.000Z",
    });
  });

  it("should operation be invalid", () => {
    const userInput = new TransactionUserInput({
      merchant: "Subway",
      amount: 20,
      time: "2019-02-13T11:01:31.000Z",
    });

    const frequency = 3;
    const interval = 60 * 2 * 1000;

    const validation = new TransactionFrequencyValidation(frequency, interval);

    const valid = validation.validate(account, userInput);
    expect(valid).toBe(false);
  });

  it("should opeartion be valid", () => {
    const userInput = new TransactionUserInput({
      merchant: "Burger King",
      amount: 10,
      time: "2019-02-13T12:00:00.000Z",
    });

    const frequency = 3;
    const interval = 60 * 2 * 1000;

    const validation = new TransactionFrequencyValidation(frequency, interval);

    const valid = validation.validate(account, userInput);
    expect(valid).toBe(true);
  });
});
