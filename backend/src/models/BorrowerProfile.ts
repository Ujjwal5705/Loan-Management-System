import mongoose from "mongoose";

const borrowerProfileSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      fullName: {
        type: String,
        required: true,
      },

      pan: {
        type: String,
        required: true,
        uppercase: true,
      },

      dob: {
        type: Date,
        required: true,
      },

      monthlySalary: {
        type: Number,
        required: true,
      },

      employmentMode: {
        type: String,
        enum: [
          "SALARIED",
          "SELF_EMPLOYED",
          "UNEMPLOYED",
        ],
        required: true,
      },

      salarySlip: String,

      brePassed: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "BorrowerProfile",
  borrowerProfileSchema
);