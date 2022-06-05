export const downPaymentAmount = (downPayment, purchasePrice) => {
    const rawDownPayment = (downPayment/100) * purchasePrice;

    return Math.round(rawDownPayment);
}

const monthlyPayment = (p, n, i) => {
  return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

export const monthlyLoanPayment = (downPayment, purchasePrice) => {
    const dpAmt = (downPayment/100) * purchasePrice;
    const P = context.purchasePrice - dpAmt; // principle amount
    const I = (context.interestRate / 100) / 12; // monthly interest rate
    const N = context.loanPeriod * 12; // number of payments months
    const M = monthlyPayment(P, N, I); // monthly mortgage payment

    return Math.round(M);
}

export const totalIncome = (rentalIncome, storageIncome, parkingIncome) => {
    const total = parseInt(rentalIncome) + parseInt(storageIncome) + parseInt(parkingIncome);

    return total;
}

export const taxAmount = (purchasePrice, taxRate) => {
    const annualTax = purchasePrice * (taxRate/100)

    return Math.round(annualTax / 12);
}

export const vacancyAmount = (vacancyRate) => {
    const rawVacancy = TotalIncome() * (vacancyRate/100);

    return Math.round(rawVacancy);  
}

export function totalExpenses() {
    const context = useContext(SoundlyInvestContext);

    return TaxAmount() + parseInt(context.propertyManager) + parseInt(context.insurance) + parseInt(context.utilities) + parseInt(context.gardener) + parseInt(context.miscellaneous) + VacancyAmount();
}

export function grm() {
    const context = useContext(SoundlyInvestContext);
    const rawGRM = context.purchasePrice / (TotalIncome() * 12)

    return rawGRM.toFixed(2);
}

export function monthlyNOI() {
    return TotalIncome() - TotalExpenses(); 
}

export function yearlyNOI() {
    return MonthlyNOI() * 12;
}

export function cashFlow() {
    return MonthlyNOI() - MonthlyLoanPayment();
}

export function ccapRate() {
    const context = useContext(SoundlyInvestContext);
    const rawCap = (YearlyNOI() / context.purchasePrice) * 100;

    return rawCap.toFixed(2);
}
