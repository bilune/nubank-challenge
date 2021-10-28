import AccountController from "./controller/account";
import Account from "./model/account";
import CommandLineView from "./view/command-line";

/**
 * Main method
 * @returns A promise that resolves when user input finishes.
 */
export async function authorizer() {
  const view = new CommandLineView();
  const model = new Account();
  const controller = new AccountController(model, view);

  await controller.execute();
  return model.getOperations();
}
