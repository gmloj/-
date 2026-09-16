import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSafeDailyBudget } from '../src/utils/financialCalculations';
import { initialUserState } from '../src/data/defaultData';
test('no spendable budget when commitments exhaust balance', () => {
 assert.equal(calculateSafeDailyBudget({...initialUserState, currentBalance: 100}), 0);
});
