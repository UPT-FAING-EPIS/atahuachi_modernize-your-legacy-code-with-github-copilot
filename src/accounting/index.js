const readlineSync = require("readline-sync");

const OPERATION = {
  TOTAL: "TOTAL ",
  CREDIT: "CREDIT",
  DEBIT: "DEBIT ",
  READ: "READ",
  WRITE: "WRITE",
};

class AccountingApp {
  constructor() {
    // Mirrors DataProgram STORAGE-BALANCE initial value.
    this.storageBalance = 1000.0;
  }

  dataProgram(operationType, balance = 0) {
    if (operationType === OPERATION.READ) {
      return this.storageBalance;
    }

    if (operationType === OPERATION.WRITE) {
      this.storageBalance = balance;
      return this.storageBalance;
    }

    return this.storageBalance;
  }

  operations(passedOperation) {
    if (passedOperation === OPERATION.TOTAL) {
      const finalBalance = this.dataProgram(OPERATION.READ);
      console.log(`Current balance: ${finalBalance.toFixed(2)}`);
      return;
    }

    if (passedOperation === OPERATION.CREDIT) {
      console.log("Enter credit amount: ");
      const amount = this.readAmount();
      const finalBalance = this.dataProgram(OPERATION.READ) + amount;
      this.dataProgram(OPERATION.WRITE, finalBalance);
      console.log(`Amount credited. New balance: ${finalBalance.toFixed(2)}`);
      return;
    }

    if (passedOperation === OPERATION.DEBIT) {
      console.log("Enter debit amount: ");
      const amount = this.readAmount();
      const finalBalance = this.dataProgram(OPERATION.READ);

      if (finalBalance >= amount) {
        const updatedBalance = finalBalance - amount;
        this.dataProgram(OPERATION.WRITE, updatedBalance);
        console.log(`Amount debited. New balance: ${updatedBalance.toFixed(2)}`);
      } else {
        console.log("Insufficient funds for this debit.");
      }
    }
  }

  readAmount() {
    const rawValue = readlineSync.question("");
    const parsed = Number.parseFloat(rawValue);

    // Keep behavior safe for Node.js migration while preserving COBOL flow.
    if (Number.isNaN(parsed)) {
      console.log("Invalid amount. Using 0.00.");
      return 0;
    }

    return parsed;
  }

  run() {
    let continueFlag = "YES";

    while (continueFlag !== "NO") {
      console.log("--------------------------------");
      console.log("Account Management System");
      console.log("1. View Balance");
      console.log("2. Credit Account");
      console.log("3. Debit Account");
      console.log("4. Exit");
      console.log("--------------------------------");
      console.log("Enter your choice (1-4): ");

      const userChoice = Number.parseInt(readlineSync.question(""), 10);

      switch (userChoice) {
        case 1:
          this.operations(OPERATION.TOTAL);
          break;
        case 2:
          this.operations(OPERATION.CREDIT);
          break;
        case 3:
          this.operations(OPERATION.DEBIT);
          break;
        case 4:
          continueFlag = "NO";
          break;
        default:
          console.log("Invalid choice, please select 1-4.");
      }
    }

    console.log("Exiting the program. Goodbye!");
  }
}

if (require.main === module) {
  const app = new AccountingApp();
  app.run();
}

module.exports = { AccountingApp, OPERATION };
