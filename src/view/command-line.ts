import * as readline from "readline";
import Controller from "../types/controller";
import View from "../types/view";

export default class CommandLineView implements View {
  public modelUpdated(data: unknown): void {
    const strData = JSON.stringify(data);
    console.log(strData);
  }

  public addListener(controller: Controller): Promise<void> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });

      rl.on("line", (line: string) => {
        const data = JSON.parse(line);
        controller.dispatch(data);
      });

      rl.on("close", resolve);
    });
  }
}
