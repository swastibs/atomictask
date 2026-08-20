import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { jwtSecret } from "../config/envConfig.js";
import { successResponse } from "../utils/response.js";
import { addToBlacklist } from "../utils/tokenBlacklist.js";

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

export const signUp = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const user = sanitizeUser(createdUser);

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!jwtSecret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const user = await User.findOne({
    email,
    isDeleted: false,
    isActive: true,
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1h" });

  const sanitizedUser = sanitizeUser(user);

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: { user: sanitizedUser, token },
  });
});

export const logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(400, "No token provided");
  }

  await addToBlacklist(token);

  return successResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    await addToBlacklist(token);
  } else {
    throw new ApiError(400, "No token provided");
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Password updated successfully",
  });
});
