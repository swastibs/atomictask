import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { jwtSecret } from "../config/envConfig.js";

const sanitizeUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  delete userObj.isDeleted;
  delete userObj.deletedBy;
  delete userObj.createdAt;
  delete userObj.updatedAt;
  return userObj;
};

export const signUpService = async ({ name, email, password }) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new ApiError(409, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return sanitizeUser(createdUser);
};

export const loginService = async ({ email, password }) => {
  if (!jwtSecret) throw new ApiError(500, "JWT secret is not configured");

  const user = await User.findOne({
    email,
    isDeleted: false,
    isActive: true,
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new ApiError(401, "Invalid credentials");

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1h" });

  return { user: sanitizeUser(user), token };
};
