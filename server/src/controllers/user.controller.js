import catchAsync from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getProfile = catchAsync(async (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: "User profile fetched successfully",
    data: {
      user: req.user,
    },
  });
});

export const getAdminDashboard = catchAsync(async (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: "Admin dashboard data fetched successfully",
    data: {
      stats: {
        totalUsers: 1000,
        totalOrders: 500,
      },
    },
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const allowed = ["name", "username", "avatar"];
  const update = Object.fromEntries(
    allowed
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]]),
  );
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, isDeleted: false, isActive: true },
    { $set: update },
    { new: true, runValidators: true },
  );
  if (!user) throw new ApiError(404, "User not found");
  const result = user.toObject();
  delete result.password;
  delete result.sessionVersion;
  delete result.isDeleted;
  delete result.deletedBy;
  return successResponse(res, {
    message: "Profile updated successfully",
    data: { user: result },
  });
});
