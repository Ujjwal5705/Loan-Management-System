import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
  loanId: mongoose.Types.ObjectId;
  utr: string;
  amount: number;
  paymentDate: Date;
  collectedBy: mongoose.Types.ObjectId;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
    utr: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);