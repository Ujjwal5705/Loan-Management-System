import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs"; // Make sure to import bcrypt here

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

// ─── ADDED: PRE-SAVE HOOK FOR PASSWORD HASHING ─────────────────────
// Note: We use a traditional 'function' rather than an arrow function
// to ensure that 'this' correctly references the current user document.
userSchema.pre<IUser>("save", async function (this: IUser) {
  // Only hash the password if it has been modified (or is brand new)
  if (!this.isModified("password")) {
    return; // Just return to stop execution, no next() needed
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error: any) {
    throw error; // Throwing an error inside an async hook automatically passes it to Mongoose
  }
});
// ───────────────────────────────────────────────────────────────────

export default mongoose.model<IUser>(
  "User",
  userSchema
);