import express from "express";
import { verify } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getUserProfile,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", verify, getAllUsers);
router.get("/profile", verify, getUserProfile);

export default router;
