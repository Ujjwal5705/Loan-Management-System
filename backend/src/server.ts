import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db";

import {
  authenticate
} from "./middleware/auth.middleware";

import authRoutes from "./routes/auth.routes";
import borrowerRoutes from "./routes/borrower.routes";
import loanRoutes from "./routes/loan.routes";
import salesRoutes from "./routes/sales.routes";
import sanctionRoutes from "./routes/sanction.routes";
import disbursementRoutes from "./routes/disbursement.routes";
import collectionRoutes from "./routes/collection.routes";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/borrower", borrowerRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/sanction", sanctionRoutes);
app.use("/api/disbursement", disbursementRoutes);
app.use("/api/collection", collectionRoutes);

app.get("/", (_, res) => {
  res.send("LMS Backend Running");
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
); 

app.get("/protected", authenticate, (req, res) => {
    res.json({
      message: "Authorized",
    });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on ${process.env.PORT}`
  );
});