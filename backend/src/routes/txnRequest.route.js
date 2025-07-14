import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { sendRequestSchema } from "../validators/txnRequest.validator.js";
import { sendRequest } from "../controllers/txnRequest.controller.js";
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", verify, validate(sendRequestSchema), sendRequest);

export default router;
