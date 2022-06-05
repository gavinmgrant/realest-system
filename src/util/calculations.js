export const totalAmount = (expenses) => {
  // add all of the numbers in the expenses array and return the total
  return expenses.reduce((acc, curr) => acc + curr, 0);
}
