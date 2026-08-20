import { Joi } from "express-validation";

const email = Joi.string()
  .email({ minDomainSegments: 2 })
  .lowercase()
  .trim()
  .messages({
    "string.email": "Please fill a valid email address",
  });

const password = Joi.string().trim().min(4).max(32).messages({
  "string.min": "Password must be at least 4 characters long",
  "string.max": "Password cannot exceed 32 characters",
});

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100).required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
      "string.min": "Name cannot be empty",
      "string.max": "Name cannot exceed 100 characters",
    }),
    email: email.required().messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),
    password: password.required().messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
    }),
  }).unknown(false),

  params: Joi.object().max(0),
  query: Joi.object().max(0),
};

export const loginSchema = {
  body: Joi.object({
    email: email.required().messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
    }),
    password: password.required().messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
    }),
  }).unknown(false),

  params: Joi.object().max(0),
  query: Joi.object().max(0),
};
