import * as readline from "readline";
import Controller from "../types/controller";
import View from "../types/view";

export default class CommandLineView implements View {
  /**
   * Output received data to the user through stdout.
   * @param data
   */
  public modelUpdated(data: unknown): void {
    const strData = JSON.stringify(data);
    console.log(strData);
  }

  /**
   * Waits for user input through stdin and notifies the controller.
   * @param controller
   * @returns
   */
  public addListener(controller: Controller): Promise<void> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });

      rl.on("line", (line: string) => {
        if (line === "") rl.close();
        try {
          const data = JSON.parse(line);
          controller.dispatch(data);
        } catch {
          rl.close();
        }
      });

      rl.on("close", resolve);
    });
  }
}
