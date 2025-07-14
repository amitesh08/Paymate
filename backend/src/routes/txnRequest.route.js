import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  respondSchema,
  sendRequestSchema,
} from "../validators/txnRequest.validator.js";
import {
  getIncomingRequests,
  getoutgoingRequests,
  respondRequest,
  sendRequest,
} from "../controllers/txnRequest.controller.js";
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", verify, validate(sendRequestSchema), sendRequest);
router.get("/incoming", verify, getIncomingRequests);
router.get("/outgoing", verify, getoutgoingRequests);
router.post("/respond", verify, validate(respondSchema), respondRequest);

export default router;
