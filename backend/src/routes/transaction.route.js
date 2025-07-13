import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getTransactionHistroy,
  sendMoney,
} from "../controllers/txn.controller.js";
import { sendMoneySchema } from "../validators/txn.validator.js";
import { verify } from "../middlewares/auth.middleware.js";
import { exportTransactionsPDF } from "../controllers/pdf.controller.js";

const router = express.Router();

router.post("/send", verify, validate(sendMoneySchema), sendMoney);
router.get("/histroy", verify, getTransactionHistroy);
router.get("/export", verify, exportTransactionsPDF);

export default router;
