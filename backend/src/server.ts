import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db";
import { authenticate } from "./middleware/auth.middleware";

import authRoutes from "./routes/auth.routes";
import borrowerRoutes from "./routes/borrower.routes";
import loanRoutes from "./routes/loan.routes";
import salesRoutes from "./routes/sales.routes";
import sanctionRoutes from "./routes/sanction.routes";
import disbursementRoutes from "./routes/disbursement.routes";
import collectionRoutes from "./routes/collection.routes";

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "https://loan-management-system-gce3jeik2.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by server production CORS security layer"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/borrower", borrowerRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/sanction", sanctionRoutes);
app.use("/api/disbursement", disbursementRoutes);
app.use("/api/collection", collectionRoutes);

app.get("/", (_, res) => {
  res.send("LMS Backend Running Successfully");
});

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Authorized",
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running safely on port ${PORT}`);
});