import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterInput) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};
