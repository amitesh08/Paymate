import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import userRoutes from "./routes/user.route.js";
import transactionRequests from "./routes/txnRequest.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

//for frontend
const allowedOrigins = [process.env.BASE_URL, "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
//to send data via URL
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/requests", transactionRequests);

app.listen(port, () => {});
