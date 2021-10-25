import { authorizer } from "src/.";
import expectStdout from "tests/utils/expectStdout";
import stdin from "tests/utils/stdin";

const mock = jest.spyOn(global.console, "log").mockImplementation(() => true);

describe("Account creation", () => {
  afterEach(() => {
    mock.mockClear();
  });

  it("should successfully create an account", async () => {
    stdin([`{"account": {"active-card": false, "available-limit": 750}}`]);

    await authorizer();

    const output = [
      `{"account":{"active-card":false,"available-limit":750},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should not create an account that violates the Authorizer logic", async () => {
    stdin([
      `{"account": {"active-card": true, "available-limit": 175}}`,
      `{"account": {"active-card": true, "available-limit": 175}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":175},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":175},"violations":["account-already-initialized"]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });
});
