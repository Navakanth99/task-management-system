import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.js";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });

      return;
    }

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

      return;
    }

    const result = await loginUser({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });

      return;
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    res.status(400).json({
      success: false,
      message,
    });
  }
};
