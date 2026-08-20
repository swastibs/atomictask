import bcrypt from "bcryptjs";
import User from "./user.model.js";
import ApiError from "../../shared/errors/ApiError.js";

export const signUp = async ({ name, email, password }) => {
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

  return user;
};
