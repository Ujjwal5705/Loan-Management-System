import { Response } from "express";

import Loan from "../models/Loan";

import { AuthRequest } from "../middleware/auth.middleware";

export const getAppliedLoans = async (req: AuthRequest, res: Response) => {
  const loans = await Loan.find({
    status: "APPLIED",
  });

  res.json(loans);
};

export const approveLoan = async (req: AuthRequest, res: Response) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan)
    return res.status(404).json({
      message: "Loan not found",
    });

  if (loan.status !== "APPLIED") {
    return res.status(400).json({
      message: `Cannot approve. Current loan status is: ${loan.status}. Only APPLIED loans can be sanctioned.`,
    });
  }

  loan.status = "SANCTIONED";

  loan.sanctionedBy = req.user.id;

  await loan.save();

  res.json(loan);
};

export const rejectLoan = async (req: AuthRequest, res: Response) => {
  const { reason } = req.body;

  const loan = await Loan.findById(req.params.id);

  if (!loan)
    return res.status(404).json({
      message: "Loan not found",
    });

  if (loan.status !== "APPLIED") {
    return res.status(400).json({
      message: `Cannot reject. Current loan status is: ${loan.status}. Only APPLIED loans can be rejected.`,
    });
  }
  
  loan.status = "REJECTED";

  loan.rejectionReason = reason;

  await loan.save();

  res.json(loan);
};
