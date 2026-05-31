import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { connectDB } from "../config/db";
import User from "../models/User";

dotenv.config();

const seed = async () => {
  await connectDB();

  await User.deleteMany({
    role: {
      $ne: "BORROWER",
    },
  });

  const password = await bcrypt.hash("Password@123", 10);

  const users = [
    {
      fullName: "Admin",
      email: "admin@lms.com",
      role: "ADMIN",
    },
    {
      fullName: "Sales",
      email: "sales@lms.com",
      role: "SALES",
    },
    {
      fullName: "Sanction",
      email: "sanction@lms.com",
      role: "SANCTION",
    },
    {
      fullName: "Disbursement",
      email: "disbursement@lms.com",
      role: "DISBURSEMENT",
    },
    {
      fullName: "Collection",
      email: "collection@lms.com",
      role: "COLLECTION",
    },
  ];

  for (const user of users) {
    await User.create({
      ...user,
      password,
    });
  }

  console.log("Seed completed");

  process.exit();
};

seed();
