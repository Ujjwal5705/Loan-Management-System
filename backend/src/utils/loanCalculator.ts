export const calculateLoan = (
  amount: number,
  tenureDays: number
) => {
  const interest =
    (amount*12*tenureDays) /
    (365*100);

  const totalRepayment =
    amount+interest;

  return {
    interestAmount: Number(
      interest.toFixed(2)
    ),

    totalRepayment: Number(
      totalRepayment.toFixed(2)
    ),
  };
};