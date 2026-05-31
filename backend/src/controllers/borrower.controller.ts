import { Response } from "express";
import BorrowerProfile from "../models/BorrowerProfile";
import { AuthRequest } from "../middleware/auth.middleware";
import { runBRE } from "../utils/bre";

export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const existingProfile = await BorrowerProfile.findOne({
      userId: req.user.id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "A profile already exists for this user.",
      });
    }

    const { fullName, pan, dob, monthlySalary, employmentMode } = req.body;

    const breResult = runBRE(dob, monthlySalary, pan, employmentMode);

    if (!breResult.passed) {
      return res.status(400).json({
        success: false,
        message: breResult.message,
      });
    }

    const profile = await BorrowerProfile.create({
      userId: req.user.id,
      fullName,
      pan,
      dob,
      monthlySalary,
      employmentMode,
      brePassed: true,
    });

    return res.status(201).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const uploadSalarySlip = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await BorrowerProfile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "File required",
      });
    }

    profile.salarySlip = req.file.filename;

    await profile.save();

    return res.json({
      success: true,
      file: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
