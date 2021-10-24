const expectStdout = (fn: jest.Mock, output: string[]) => {
  output.forEach((line, index) => {
    expect(fn).toHaveBeenNthCalledWith(index + 1, line);
  });
};

export default expectStdout;
