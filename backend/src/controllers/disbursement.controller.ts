import { Response } from "express";

import Loan from "../models/Loan";

import { AuthRequest } from "../middleware/auth.middleware";

export const getSanctionedLoans = async (req: AuthRequest, res: Response) => {
  const loans = await Loan.find({
    status: "SANCTIONED",
  });

  res.json(loans);
};

export const disburseLoan = async (req: AuthRequest, res: Response) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan)
    return res.status(404).json({
      message: "Loan not found",
    });

  if (loan.status !== "SANCTIONED") {
    return res.status(400).json({
      message: `Cannot disburse. Current loan status is: ${loan.status}. Only SANCTIONED loans can be disbursed.`,
    });
  }

  loan.status = "DISBURSED";

  loan.disbursedAt = new Date();

  loan.disbursedBy = req.user.id;

  await loan.save();

  res.json(loan);
};
