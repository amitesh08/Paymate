import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(404).json({
      success: false,
      message: "Please fill all the fields!",
    });
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "error creating user!",
      });
    }

    const token = generateToken(newUser.id);

    //store it in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //true in production
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.log("error creating user" + error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

export { registerUser };
