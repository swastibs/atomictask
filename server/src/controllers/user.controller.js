import catchAsync from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

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
