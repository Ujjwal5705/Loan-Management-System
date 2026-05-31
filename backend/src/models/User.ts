import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "ADMIN",
        "SALES",
        "SANCTION",
        "DISBURSEMENT",
        "COLLECTION",
        "BORROWER",
      ],
      default: "BORROWER",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>(
  "User",
  userSchema
);