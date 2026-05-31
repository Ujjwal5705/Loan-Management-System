import { Response } from "express";
import Loan from "../models/Loan";
import BorrowerProfile from "../models/BorrowerProfile";
import { AuthRequest } from "../middleware/auth.middleware";
import { calculateLoan } from "../utils/loanCalculator";

export const applyLoan = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, tenureDays } = req.body;

    if (amount < 50000 || amount > 500000) {
      return res.status(400).json({
        message: "Amount must be between 50000 and 500000",
      });
    }

    if (tenureDays < 30 || tenureDays > 365) {
      return res.status(400).json({
        message: "Tenure must be between 30 and 365",
      });
    }

    const profile = await BorrowerProfile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(400).json({
        message: "Create profile first",
      });
    }

    if (!profile.salarySlip) {
      return res.status(400).json({
        message: "Upload salary slip first",
      });
    }

    const activeLoan = await Loan.findOne({
      borrowerId: req.user.id,
      status: {
        $in: ["APPLIED", "SANCTIONED", "DISBURSED"],
      },
    });

    if (activeLoan) {
      return res.status(400).json({
        message: "Active loan already exists",
      });
    }

    const loanData = calculateLoan(amount, tenureDays);

    const loan = await Loan.create({
      borrowerId: req.user.id,
      amount,
      tenureDays,
      interestRate: 12,
      interestAmount: loanData.interestAmount,
      totalRepayment: loanData.totalRepayment,
      outstandingBalance: loanData.totalRepayment,
      status: "APPLIED",
    });

    return res.status(201).json({
      success: true,
      loan,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getMyLoans = async (req: AuthRequest, res: Response) => {
  const loans = await Loan.find({
    borrowerId: req.user.id,
  });

  return res.json(loans);
};

export const calculatePreview = async (req: AuthRequest, res: Response) => {
  const { amount, tenureDays } = req.body;

  const result = calculateLoan(amount, tenureDays);

  return res.json(result);
};
