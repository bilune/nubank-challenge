import AccountController from "src/controller/account";
import Account from "src/model/account";
import CommandLineView from "src/view/command-line";

/**
 * Main method
 * @returns A promise that resolves when user input finishes.
 */
export function authorizer() {
  return new Promise((resolve) => {
    const view = new CommandLineView();
    const model = new Account();
    const controller = new AccountController(model, view);

    controller.execute().then(resolve);
  });
}
