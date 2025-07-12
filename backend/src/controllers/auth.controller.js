import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { success } from "zod";

//register user
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
        balance: 1000, //starting bonus.
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
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        balance: newUser.balance,
      },
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

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields!",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user didn't exist!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: " Invalid Credentials!",
      });
    }

    const token = generateToken(user.id);

    //store it in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //true in production
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
      token,
    });
  } catch (error) {
    console.log("error logging user" + error);
    return res.status(500).json({
      success: false,
      message: "Signin failed",
    });
  }
};

//profile route
const currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: `Welcome ${user.name} `,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Can't fetch user! login again",
    });
  }
};

//logout controller
const logoutUser = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };

  // Properly clear cookies by setting expired dates
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "User logged out Successfully!",
  });
};

export { registerUser, loginUser, currentUser, logoutUser };
