import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { jwtSecret } from "../config/envConfig.js";
import { successResponse } from "../utils/response.js";

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
  if (existingEmail) throw new ApiError(409, "Email already exists");

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

  const sanitizedUser = sanitizeUser(user);

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: { user: sanitizedUser, token },
  });
});
