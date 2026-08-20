import catchAsync from "../../shared/utils/catchAsync.js";
import User from "./user.model.js";
import ApiError from "../../shared/errors/ApiError.js";
import { successResponse } from "../../shared/utils/response.js";
import bcrypt from "bcryptjs";

export const signUp = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new ApiError(400, "Name, email and password are required");

  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new ApiError(409, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const user = createdUser.toObject();
  delete user.password;
  delete user.__v;
  delete user.isVerified;
  delete user.isActive;
  delete user.isDeleted;
  delete user.createdAt;
  delete user.updatedAt;

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});
