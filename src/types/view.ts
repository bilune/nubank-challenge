import Controller from "./controller";

export default interface View {
  modelUpdated(data: unknown): void;
  addListener(controller: Controller): void;
}
