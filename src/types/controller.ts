export default interface Controller {
  execute(): void;
  dispatch(data: Record<string, any>): void;
}
