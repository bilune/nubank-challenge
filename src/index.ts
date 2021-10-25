import AccountController from "./controllers/account";
import Account from "./model/account";
import CommandLineView from "./view/command-line";

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
