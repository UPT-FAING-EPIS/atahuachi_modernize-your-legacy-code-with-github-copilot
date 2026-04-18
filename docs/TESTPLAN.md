# COBOL Student Account System Test Plan

This test plan validates the current business logic and runtime behavior of the COBOL application before migration to Node.js.

## Scope

- Programs covered:
  - main.cob
  - operations.cob
  - data.cob
- Business flows covered:
  - View balance
  - Credit account
  - Debit account
  - Insufficient funds handling
  - Menu control flow (invalid option and exit)
- Data behavior covered:
  - Initial balance
  - Balance persistence across operations in one execution

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify app startup and menu display | Application compiled as accountsystem | 1. Run ./accountsystem | Menu is displayed with options 1-4 and prompt for choice | TBD | TBD | Validate exact menu text with stakeholders if needed |
| TC-002 | Verify exit flow from menu | App is running at main menu | 1. Enter 4 | Application ends and displays goodbye message | TBD | TBD | Confirms termination behavior |
| TC-003 | Verify invalid menu option handling | App is running at main menu | 1. Enter 0 (or 5) | Error message for invalid choice is displayed and menu loop continues | TBD | TBD | Covers WHEN OTHER branch in menu logic |
| TC-004 | Verify initial balance query | Fresh app execution (no prior operations in same run) | 1. Enter 1 to view balance | Current balance shown as 1000.00 | TBD | TBD | Validates default in-memory starting balance |
| TC-005 | Verify credit operation updates balance | Fresh app execution; starting balance 1000.00 | 1. Enter 2 2. Enter amount 200.00 3. Enter 1 to view balance | Credit confirmation shown; new balance equals 1200.00 | TBD | TBD | Validates READ -> ADD -> WRITE flow |
| TC-006 | Verify debit operation with sufficient funds | Fresh app execution; starting balance 1000.00 | 1. Enter 3 2. Enter amount 250.00 3. Enter 1 to view balance | Debit confirmation shown; new balance equals 750.00 | TBD | TBD | Validates READ -> SUBTRACT -> WRITE flow |
| TC-007 | Verify debit operation with exact available balance | Fresh app execution; starting balance 1000.00 | 1. Enter 3 2. Enter amount 1000.00 3. Enter 1 to view balance | Debit succeeds; resulting balance equals 0.00 | TBD | TBD | Validates boundary condition for >= rule |
| TC-008 | Verify debit operation with insufficient funds | Fresh app execution; starting balance 1000.00 | 1. Enter 3 2. Enter amount 1000.01 3. Enter 1 to view balance | Insufficient funds message shown; balance remains 1000.00 | TBD | TBD | Validates protection against over-debit |
| TC-009 | Verify balance persistence across multiple operations in one session | Fresh app execution | 1. Enter 2 and amount 300.00 2. Enter 3 and amount 100.00 3. Enter 1 | Final balance shown as 1200.00 | TBD | TBD | Confirms in-memory persistence during one run |
| TC-010 | Verify menu loop continues after non-exit operations | App is running | 1. Enter 1 2. Enter 2 and any valid amount 3. Observe prompt returns each time | After each operation, app returns to menu until option 4 is entered | TBD | TBD | Validates PERFORM UNTIL loop behavior |
| TC-011 | Verify decimal amount processing (2 decimal places) on credit | Fresh app execution; starting balance 1000.00 | 1. Enter 2 2. Enter amount 10.25 3. Enter 1 | New balance shown as 1010.25 | TBD | TBD | Validates amount/balance PIC 9(6)V99 behavior |
| TC-012 | Verify decimal amount processing (2 decimal places) on debit | Fresh app execution; starting balance 1000.00 | 1. Enter 3 2. Enter amount 10.25 3. Enter 1 | New balance shown as 989.75 | TBD | TBD | Validates amount/balance PIC 9(6)V99 behavior |
| TC-013 | Verify session reset behavior after restart | Complete one run with balance change, then restart app | 1. Run app and credit 100.00 2. Exit 3. Run app again 4. Enter 1 | Balance starts again at 1000.00 on new execution | TBD | TBD | Confirms current implementation has no persistent storage across runs |
| TC-014 | Verify credit with zero amount | Fresh app execution; starting balance 1000.00 | 1. Enter 2 2. Enter amount 0.00 3. Enter 1 | Operation succeeds; balance remains 1000.00 | TBD | TBD | Clarify with stakeholders if zero-amount transactions are allowed |
| TC-015 | Verify debit with zero amount | Fresh app execution; starting balance 1000.00 | 1. Enter 3 2. Enter amount 0.00 3. Enter 1 | Operation succeeds; balance remains 1000.00 | TBD | TBD | Clarify with stakeholders if zero-amount transactions are allowed |

## Notes for Stakeholder Validation

- This plan documents current behavior of the COBOL implementation, including constraints and gaps.
- Input validation for invalid numeric input and negative values is not explicitly implemented in the business logic and should be agreed as target behavior for Node.js migration.
- The system currently handles a single shared account balance with in-memory state only.

## Suggested Mapping for Node.js Test Automation (Later)

- Use each Test Case ID as the canonical test identifier in automated suites.
- Reuse this table for:
  - Unit tests for operation functions (credit, debit, balance checks)
  - Integration tests for end-to-end menu/command flows
- Keep Actual Result, Status, and Comments columns as execution evidence fields during UAT and regression cycles.
