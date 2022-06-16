export const totalAmount = (expenses) => {
  // add all of the numbers in the expenses array and return the total
  return expenses.reduce((acc, curr) => acc + curr, 0);
};

export const getTotalIncome = (properties, units, id) => {
  const property = properties.find((property) => property.id === id);
  let total = 0;
  for (let i = 0; i < units?.length; i++) {
    if (units[i].property_id === property.id) {
      total += units[i].rent_current;
      total += units[i].income_parking;
      total += units[i].income_storage;
    }
  }
  return total;
};

export const monthlyLoanPayment = (
  purchasePrice,
  downPayment,
  interestRate,
  loanPeriod
) => {
  // helper function to calculate monthly loan payment
  const monthlyPayment = (p, n, i) => {
    return (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) || 0;
  };
  const P = purchasePrice - downPayment; // principle amount
  const I = interestRate / 12; // monthly interest rate
  const N = loanPeriod; // number of payments months
  const M = monthlyPayment(P, N, I); // monthly mortgage payment

  return Math.round(M);
};

export const monthlyNOI = (income, expenses) => {
  return income - expenses;
};

export const annualNOI = (income, expenses) => {
  return monthlyNOI(income, expenses) * 12;
};

export const grossRentMultiplier = (purchasePrice, totalIncome) => {
  const grm = purchasePrice / (totalIncome * 12);
  return !grm ? 0 : grm.toFixed(2);
};

export const cashFlow = (monthlyNOI, monthlyLoanPayment) => {
  return monthlyNOI - monthlyLoanPayment;
};

export const capRate = (annualNOI, purchasePrice) => {
  const cap = (annualNOI / purchasePrice) * 100;

  return cap ? cap.toFixed(2) : 0;
};
