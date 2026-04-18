jest.mock("readline-sync", () => ({
  question: jest.fn(),
}));

const readlineSync = require("readline-sync");
const { AccountingApp } = require("../index");

function setInputs(inputs) {
  readlineSync.question.mockReset();
  inputs.forEach((value) => {
    readlineSync.question.mockImplementationOnce(() => String(value));
  });
}

function runAppWithInputs(inputs) {
  const app = new AccountingApp();
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  setInputs(inputs);
  app.run();
  const output = logSpy.mock.calls.map((call) => call.join(" "));
  logSpy.mockRestore();
  return { app, output };
}

describe("COBOL parity test plan for Node.js accounting app", () => {
  test("TC-001: startup displays menu options", () => {
    const { output } = runAppWithInputs([4]);

    expect(output).toContain("Account Management System");
    expect(output).toContain("1. View Balance");
    expect(output).toContain("2. Credit Account");
    expect(output).toContain("3. Debit Account");
    expect(output).toContain("4. Exit");
    expect(output).toContain("Enter your choice (1-4): ");
  });

  test("TC-002: option 4 exits with goodbye message", () => {
    const { output } = runAppWithInputs([4]);
    expect(output).toContain("Exiting the program. Goodbye!");
  });

  test("TC-003: invalid option shows error and menu continues", () => {
    const { output } = runAppWithInputs([0, 4]);

    expect(output).toContain("Invalid choice, please select 1-4.");
    expect(output.filter((line) => line === "Account Management System")).toHaveLength(2);
  });

  test("TC-004: initial balance is 1000.00", () => {
    const { output } = runAppWithInputs([1, 4]);
    expect(output).toContain("Current balance: 1000.00");
  });

  test("TC-005: credit updates balance (1000 + 200 = 1200)", () => {
    const { output, app } = runAppWithInputs([2, 200, 1, 4]);

    expect(output).toContain("Amount credited. New balance: 1200.00");
    expect(output).toContain("Current balance: 1200.00");
    expect(app.storageBalance).toBe(1200);
  });

  test("TC-006: debit with sufficient funds updates balance (1000 - 250 = 750)", () => {
    const { output, app } = runAppWithInputs([3, 250, 1, 4]);

    expect(output).toContain("Amount debited. New balance: 750.00");
    expect(output).toContain("Current balance: 750.00");
    expect(app.storageBalance).toBe(750);
  });

  test("TC-007: debit with exact balance succeeds (1000 - 1000 = 0)", () => {
    const { output, app } = runAppWithInputs([3, 1000, 1, 4]);

    expect(output).toContain("Amount debited. New balance: 0.00");
    expect(output).toContain("Current balance: 0.00");
    expect(app.storageBalance).toBe(0);
  });

  test("TC-008: debit with insufficient funds is rejected", () => {
    const { output, app } = runAppWithInputs([3, 1000.01, 1, 4]);

    expect(output).toContain("Insufficient funds for this debit.");
    expect(output).toContain("Current balance: 1000.00");
    expect(app.storageBalance).toBe(1000);
  });

  test("TC-009: balance persists across operations in same session", () => {
    const { output, app } = runAppWithInputs([2, 300, 3, 100, 1, 4]);

    expect(output).toContain("Current balance: 1200.00");
    expect(app.storageBalance).toBe(1200);
  });

  test("TC-010: menu loop continues after non-exit operations", () => {
    const { output } = runAppWithInputs([1, 2, 50, 4]);

    expect(output.filter((line) => line === "Account Management System")).toHaveLength(3);
    expect(output).toContain("Current balance: 1000.00");
    expect(output).toContain("Amount credited. New balance: 1050.00");
  });

  test("TC-011: credit supports 2 decimal places", () => {
    const { output, app } = runAppWithInputs([2, 10.25, 1, 4]);

    expect(output).toContain("Amount credited. New balance: 1010.25");
    expect(output).toContain("Current balance: 1010.25");
    expect(app.storageBalance).toBeCloseTo(1010.25, 2);
  });

  test("TC-012: debit supports 2 decimal places", () => {
    const { output, app } = runAppWithInputs([3, 10.25, 1, 4]);

    expect(output).toContain("Amount debited. New balance: 989.75");
    expect(output).toContain("Current balance: 989.75");
    expect(app.storageBalance).toBeCloseTo(989.75, 2);
  });

  test("TC-013: restarting app resets session balance to 1000.00", () => {
    const firstRun = runAppWithInputs([2, 100, 4]);
    expect(firstRun.output).toContain("Amount credited. New balance: 1100.00");
    expect(firstRun.app.storageBalance).toBe(1100);

    const secondRun = runAppWithInputs([1, 4]);
    expect(secondRun.output).toContain("Current balance: 1000.00");
    expect(secondRun.app.storageBalance).toBe(1000);
  });

  test("TC-014: credit with zero amount keeps balance unchanged", () => {
    const { output, app } = runAppWithInputs([2, 0, 1, 4]);

    expect(output).toContain("Amount credited. New balance: 1000.00");
    expect(output).toContain("Current balance: 1000.00");
    expect(app.storageBalance).toBe(1000);
  });

  test("TC-015: debit with zero amount keeps balance unchanged", () => {
    const { output, app } = runAppWithInputs([3, 0, 1, 4]);

    expect(output).toContain("Amount debited. New balance: 1000.00");
    expect(output).toContain("Current balance: 1000.00");
    expect(app.storageBalance).toBe(1000);
  });
});
