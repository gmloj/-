import test from 'node:test';
import assert from 'node:assert/strict';
import * as ledger from '../src/utils/financialCalculations';
import { initialUserState } from '../src/data/defaultData';
const ops = ledger as any;
const state = {...initialUserState, ledgerDate: '2026-09-15', todayExpenses: []};
test('expense decreases balance and removal restores it without double refund', () => {
 assert.equal(typeof ops.addExpense, 'function');
 const next = ops.addExpense(state, {id:'test', title:'coffee', amount:12.5, category:'coffee', timestamp:'10:00'});
 assert.equal(next.currentBalance,717.5);
 assert.equal(next.todayExpenses.length,1);
 const restored = ops.removeExpense(next, 'test');
 assert.equal(restored.currentBalance,730);
 assert.equal(ops.removeExpense(restored, 'test').currentBalance,730);
});
test('invalid amounts cannot change the ledger', () => {
 assert.equal(typeof ops.addExpense, 'function');
 for (const amount of [-1, 0, NaN, Infinity]) assert.throws(()=>ops.addExpense(state,{id:'bad',title:'bad',amount,category:'other',timestamp:''}));
});
test('rollover archives expenses, advances days, does not deduct again', () => {
 assert.equal(typeof ops.rollover, 'function');
 const next = ops.rollover({...state,todayExpenses:[{id:'a',title:'a',amount:1,category:'other',timestamp:''},{id:'b',title:'b',amount:2,category:'other',timestamp:''}]},'2026-09-17');
 assert.equal(next.currentBalance,730);
 assert.equal(next.daysToSalary,10);
 assert.equal(next.todayExpenses.length,0);
 assert.equal(next.expenseHistory.length,2);
 assert.equal(next.commitments[0].dueInDays,2);
 assert.deepEqual(ops.rollover(next,'2026-09-17'),next);
});
