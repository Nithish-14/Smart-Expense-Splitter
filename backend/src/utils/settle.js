function settleBalances(balances) {
  const arr = Object.entries(balances).map(([id, amount]) => ({
    id,
    amount: Math.round(amount * 100) / 100,
  }));
  const transactions = [];

  const eps = 0.01;
  while (true) {
    arr.sort((a, b) => a.amount - b.amount);
    if (Math.abs(arr[0].amount) < eps && Math.abs(arr[arr.length - 1].amount) < eps) break;
    const debtor = arr[0];
    const creditor = arr[arr.length - 1];
    const amount = Math.min(creditor.amount, -debtor.amount);
    if (Math.abs(amount) < eps) break;

    transactions.push({ from: debtor.id, to: creditor.id, amount: Math.round(amount * 100) / 100 });

    debtor.amount += amount;
    creditor.amount -= amount;
  }
  return transactions;
}

module.exports = { settleBalances };
