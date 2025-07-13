import express from "express";
import { verify } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/getAllUsers.controller.js";

const router = express.Router();

router.get("/", verify, getAllUsers);

export default router;
