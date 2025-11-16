function splitEqual(amount, count) {
  const base = Math.floor((amount / count) * 100) / 100; // two decimals
  const remainder = Math.round((amount - base * count) * 100) / 100;
  const shares = Array(count).fill(base);

  for (let i = 0; i < Math.round(remainder * 100); i++) {
    shares[i % count] += 0.01;
  }
  return shares;
}

module.exports = { splitEqual };
