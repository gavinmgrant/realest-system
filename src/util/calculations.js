export const totalAmount = (expenses) => {
  // add all of the numbers in the expenses array and return the total
  return expenses.reduce((acc, curr) => acc + curr, 0);
};

export const monthlyNOI = (income, expenses) => {
  return income - expenses;
};

export const annualNOI = (income, expenses) => {
  return monthlyNOI(income, expenses) * 12;
};

export const grossRentMultiplier = (purchasePrice, totalIncome) => {
  const grm = Number(purchasePrice) / (totalIncome * 12);
  console.log(totalIncome);
  return !grm ? 0 : grm.toFixed(2);
};
