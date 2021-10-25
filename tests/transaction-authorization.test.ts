import { authorizer } from "src/.";
import expectStdout from "tests/utils/expectStdout";
import stdin from "tests/utils/stdin";

const mock = jest.spyOn(global.console, "log").mockImplementation(() => true);

describe("Transaction authorization", () => {
  afterEach(() => {
    mock.mockClear();
  });

  it("should process a transaction successfully", async () => {
    stdin([
      `{"account":{"active-card":true,"available-limit":100}}`,
      `{"transaction":{"merchant":"Burger King","amount":20,"time":"2019-02-13T11:00:00.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":100},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":80},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should process a transaction which violates the `account-not-initialized` logic", async () => {
    stdin([
      `{"transaction": {"merchant": "Uber Eats", "amount": 25, "time": "2020-12-01T11:07:00.000Z"}}`,
      `{"account": {"active-card": true, "available-limit": 225}}`,
      `{"transaction": {"merchant": "Uber Eats", "amount": 25, "time": "2020-12-01T11:07:00.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{},"violations":["account-not-initialized"]}`,
      `{"account":{"active-card":true,"available-limit":225},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":200},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should process a transaction which violates `card-not-active` logic", async () => {
    stdin([
      `{"account": {"active-card": false, "available-limit": 100}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T11:00:00.000Z"}}`,
      `{"transaction": {"merchant": "Habbib's", "amount": 15, "time": "2019-02-13T11:15:00.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":false,"available-limit":100},"violations":[]}`,
      `{"account":{"active-card":false,"available-limit":100},"violations":["card-not-active"]}`,
      `{"account":{"active-card":false,"available-limit":100},"violations":["card-not-active"]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should process a transaction which violates `insufficient-limit` logic", async () => {
    stdin([
      `{"account": {"active-card": true, "available-limit": 1000}}`,
      `{"transaction": {"merchant": "Vivara", "amount": 1250, "time": "2019-02-13T11:00:00.000Z"}}`,
      `{"transaction": {"merchant": "Samsung", "amount": 2500, "time": "2019-02-13T11:00:01.000Z"}}`,
      `{"transaction": {"merchant": "Nike", "amount": 800, "time": "2019-02-13T11:01:01.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":1000},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":1000},"violations":["insufficient-limit"]}`,
      `{"account":{"active-card":true,"available-limit":1000},"violations":["insufficient-limit"]}`,
      `{"account":{"active-card":true,"available-limit":200},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should process a transaction which violates the `high-frequency-small-interval` logic", async () => {
    stdin([
      `{"account": {"active-card": true, "available-limit": 100}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T11:00:00.000Z"}}`,
      `{"transaction": {"merchant": "Habbib's", "amount": 20, "time": "2019-02-13T11:00:01.000Z"}}`,
      `{"transaction": {"merchant": "McDonald's", "amount": 20, "time": "2019-02-13T11:01:01.000Z"}}`,
      `{"transaction": {"merchant": "Subway", "amount": 20, "time": "2019-02-13T11:01:31.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 10, "time": "2019-02-13T12:00:00.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":100},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":80},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":60},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":40},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":40},"violations":["high-frequency-small-interval"]}`,
      `{"account":{"active-card":true,"available-limit":30},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should process a transaction which violates the `doubled-transaction` logic", async () => {
    stdin([
      `{"account": {"active-card": true, "available-limit": 100}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T11:00:00.000Z"}}`,
      `{"transaction": {"merchant": "McDonald's", "amount": 10, "time": "2019-02-13T11:00:01.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T11:00:02.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 15, "time": "2019-02-13T11:00:03.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":100},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":80},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":70},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":70},"violations":["doubled-transaction"]}`,
      `{"account":{"active-card":true,"available-limit":55},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should process transactions that violate multiple logics", async () => {
    stdin([
      `{"account": {"active-card": true, "available-limit": 100}}`,
      `{"transaction": {"merchant": "McDonald's", "amount": 10, "time": "2019-02-13T11:00:01.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 20, "time": "2019-02-13T11:00:02.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 5, "time": "2019-02-13T11:00:07.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 5, "time": "2019-02-13T11:00:08.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 150, "time": "2019-02-13T11:00:18.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 190, "time": "2019-02-13T11:00:22.000Z"}}`,
      `{"transaction": {"merchant": "Burger King", "amount": 15, "time": "2019-02-13T12:00:27.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":100},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":90},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":70},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":65},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":65},"violations":["high-frequency-small-interval","doubled-transaction"]}`,
      `{"account":{"active-card":true,"available-limit":65},"violations":["insufficient-limit","high-frequency-small-interval"]}`,
      `{"account":{"active-card":true,"available-limit":65},"violations":["insufficient-limit","high-frequency-small-interval"]}`,
      `{"account":{"active-card":true,"available-limit":50},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });

  it("should not save operations that had violations in the application's internal state", async () => {
    stdin([
      `{"account": {"active-card": true, "available-limit": 1000}}`,
      `{"transaction": {"merchant": "Vivara", "amount": 1250, "time": "2019-02-13T11:00:00.000Z"}}`,
      `{"transaction": {"merchant": "Samsung", "amount": 2500, "time": "2019-02-13T11:00:01.000Z"}}`,
      `{"transaction": {"merchant": "Nike", "amount": 800, "time": "2019-02-13T11:01:01.000Z"}}`,
      `{"transaction": {"merchant": "Uber", "amount": 80, "time": "2019-02-13T11:01:31.000Z"}}`,
    ]);

    await authorizer();

    const output = [
      `{"account":{"active-card":true,"available-limit":1000},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":1000},"violations":["insufficient-limit"]}`,
      `{"account":{"active-card":true,"available-limit":1000},"violations":["insufficient-limit"]}`,
      `{"account":{"active-card":true,"available-limit":200},"violations":[]}`,
      `{"account":{"active-card":true,"available-limit":120},"violations":[]}`,
    ];

    expectStdout(<jest.Mock>console.log, output);
  });
});
