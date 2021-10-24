const stdin = (input: string[]): void => {
  const lib = require("mock-stdin").stdin();
  process.nextTick(() => {
    lib.send(input.join("\n"));
    lib.end();
  });
};

export default stdin;
