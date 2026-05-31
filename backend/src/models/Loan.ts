import mongoose, { Document } from "mongoose";

export interface ILoan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: "APPLIED" | "REJECTED" | "SANCTIONED" | "DISBURSED" | "CLOSED";
  rejectionReason?: string;
  sanctionedBy?: mongoose.Types.ObjectId;
  disbursedBy?: mongoose.Types.ObjectId;
  disbursedAt?: Date;
  closedAt?: Date;
}

const loanSchema = new mongoose.Schema<ILoan>(
  {
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tenureDays: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      default: 12,
    },
    interestAmount: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    outstandingBalance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["APPLIED", "REJECTED", "SANCTIONED", "DISBURSED", "CLOSED"],
      default: "APPLIED",
    },
    rejectionReason: String,
    sanctionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    disbursedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    disbursedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

loanSchema.index({ borrowerId: 1 });
loanSchema.index({ status: 1 });

export default mongoose.model<ILoan>("Loan", loanSchema);