import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { sendMoney } from "../controllers/txn.controller.js";
import { sendMoneySchema } from "../validators/txn.validator.js";
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", verify, validate(sendMoneySchema), sendMoney);

export default router;
