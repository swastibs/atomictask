import catchAsync from "../utils/catchAsync.js";
import { loginService, signUpService } from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";

export const signUp = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await signUpService({ name, email, password });

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginService({ email, password });

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: { user, token },
  });
});
