import { Response } from "express";

import Loan from "../models/Loan";
import Payment from "../models/Payment";

import { AuthRequest } from "../middleware/auth.middleware";

export const recordPayment = async (req: AuthRequest, res: Response) => {
  const { loanId, utr, amount, paymentDate } = req.body;

  const existing = await Payment.findOne({
    utr,
  });

  if (existing) {
    return res.status(400).json({
      message: "UTR already exists",
    });
  }

  const loan = await Loan.findById(loanId);

  if (!loan) {
    return res.status(404).json({
      message: "Loan not found",
    });
  }

  if (loan.status !== "DISBURSED") {
    return res.status(400).json({
      message: "Payments can only be recorded for disbursed loans",
    });
  }

  if (amount > loan.outstandingBalance) {
    return res.status(400).json({
      message: "Payment exceeds outstanding balance",
    });
  }

  await Payment.create({
    loanId,
    utr,
    amount,
    paymentDate,
    collectedBy: req.user.id,
  });

  loan.totalPaid += amount;

  loan.outstandingBalance -= amount;

  if (loan.outstandingBalance <= 0) {
    loan.status = "CLOSED";

    loan.closedAt = new Date();
  }

  await loan.save();

  return res.json({
    success: true,
    loan,
  });
};
