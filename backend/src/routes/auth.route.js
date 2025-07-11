import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", validate(registerSchema), registerUser);
router.post("/signin", validate(loginSchema), loginUser);
router.get("/me", verify, currentUser);
router.post("/logout", verify, logoutUser);
// router.get("/", (req, res) => {
//   res.json({
//     message: "server is running!",
//   });
// });

export default router;
