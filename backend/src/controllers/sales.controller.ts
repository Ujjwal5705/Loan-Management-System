import { Request, Response } from "express";
import User from "../models/User";
import Loan from "../models/Loan";

export const getLeads = async (req: Request, res: Response) => {
  try {
    const borrowersWithLoans = await Loan.distinct("borrowerId");

    const leads = await User.find({
      role: "BORROWER",
      _id: { $nin: borrowersWithLoans },
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
