import catchAsync from "../../shared/utils/catchAsync.js";
import { signUp as signUpService } from "./auth.service.js";
import { successResponse } from "../../shared/utils/response.js";

export const signUp = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await signUpService({ name, email, password });

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});
