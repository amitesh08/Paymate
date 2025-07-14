import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { sendRequestSchema } from "../validators/txnRequest.validator.js";
import {
  getIncomingRequests,
  getoutgoingRequests,
  sendRequest,
} from "../controllers/txnRequest.controller.js";
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", verify, validate(sendRequestSchema), sendRequest);
router.get("/incoming", verify, getIncomingRequests);
router.get("/outgoing", verify, getoutgoingRequests);

export default router;
