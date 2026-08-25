import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { jwtSecret } from "../config/envConfig.js";
import { successResponse } from "../utils/response.js";
import { addToBlacklist } from "../utils/tokenBlacklist.js";

const DUMMY_PASSWORD_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEe.2N4pY8z8N9qz7S8FQ6g0j2p0o5J7Z7G";

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
  const { name, username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    name,
    username,
    email: normalizedEmail,
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
  const { email, username, password } = req.body;

  if (!jwtSecret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const user = await User.findOne({
    ...(email
      ? { email: email.toLowerCase().trim() }
      : { username: username.toLowerCase().trim() }),
    isDeleted: false,
    isActive: true,
  }).select("+password +sessionVersion");

  const passwordMatches = await bcrypt.compare(
    password,
    user?.password || DUMMY_PASSWORD_HASH,
  );
  if (!user || !passwordMatches) {
    throw new ApiError(401, "Invalid credentials");
  }

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    sessionVersion: user.sessionVersion || 0,
    jti: randomUUID(),
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
  user.sessionVersion = (user.sessionVersion || 0) + 1;
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

export const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");
  return successResponse(res, {
    message: "Current user fetched successfully",
    data: sanitizeUser(user),
  });
});
