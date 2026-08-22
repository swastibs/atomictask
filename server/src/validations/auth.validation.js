import { Joi } from "express-validation";

const email = Joi.string()
  .email({ minDomainSegments: 2 })
  .lowercase()
  .trim()
  .messages({
    "string.email": "Please fill a valid email address",
  });

const password = Joi.string().min(4).max(32).messages({
  "string.min": "Password must be at least 4 characters long",
  "string.max": "Password cannot exceed 32 characters",
});

const strongPassword = Joi.string()
  .min(4)
  .max(72)
  .messages({
    "string.min": "Password must be at least 4 characters long",
    "string.max": "Password cannot exceed 72 characters",
  });

const username = Joi.string()
  .trim()
  .lowercase()
  .min(3)
  .max(30)
  .pattern(/^[a-z0-9_]+$/);

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100).required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
      "string.min": "Name cannot be empty",
      "string.max": "Name cannot exceed 100 characters",
    }),
    username: username.optional(),
    email: email.required().messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),
    password: strongPassword.required().messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
    }),
  }).unknown(false),

  params: Joi.object().max(0),
  query: Joi.object().max(0),
};

export const loginSchema = {
  body: Joi.object({
    email: email.optional(),
    username: username.optional(),
    password: password.required().messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),
    password: password.required().messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
    }),
  }).or("email", "username").unknown(false),

  params: Joi.object().max(0),
  query: Joi.object().max(0),
};

export const updatePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "Current password is required",
      "string.empty": "Current password is required",
    }),
    newPassword: strongPassword.required().messages({
      "any.required": "New password is required",
      "string.empty": "New password is required",
    }),
    confirmNewPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.required": "Confirm new password is required",
        "string.empty": "Confirm new password is required",
        "any.only": "Passwords do not match",
      }),
  }).unknown(false),

  params: Joi.object().max(0),
  query: Joi.object().max(0),
};

export const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100),
    username: username,
    avatar: Joi.string().uri({ scheme: ["http", "https"] }).max(500).allow(null, ""),
  }).min(1).unknown(false),
  params: Joi.object().max(0),
  query: Joi.object().max(0),
};
