import { Joi } from "express-validation";

const objectId = Joi.string().hex().length(24).messages({
  "string.hex": "Must be a valid ObjectId (hexadecimal)",
  "string.length": "Must be a valid ObjectId (24 characters)",
});

const frequencyEnum = ["daily", "weekly", "custom"];

export const createHabitSchema = {
  body: Joi.object({
    name: Joi.string().trim().max(100).required().messages({
      "string.empty": "Habit name is required",
      "any.required": "Habit name is required",
      "string.max": "Habit name cannot exceed 100 characters",
    }),
    description: Joi.string().trim().max(500).optional().messages({
      "string.max": "Description cannot exceed 500 characters",
    }),
    icon: Joi.string().trim().max(50).optional(),
    color: Joi.string().trim().max(20).optional(),
    frequency: Joi.string()
      .valid(...frequencyEnum)
      .default("daily"),
    targetDays: Joi.array()
      .items(Joi.number().integer().min(0).max(6))
      .optional(),
    reminderTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
  }).unknown(false),
};

export const updateHabitSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().max(100).optional(),
    description: Joi.string().trim().max(500).optional(),
    icon: Joi.string().trim().max(50).optional(),
    color: Joi.string().trim().max(20).optional(),
    frequency: Joi.string()
      .valid(...frequencyEnum)
      .optional(),
    targetDays: Joi.array()
      .items(Joi.number().integer().min(0).max(6))
      .optional(),
    reminderTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    isActive: Joi.boolean().optional(),
    isArchived: Joi.boolean().optional(),
  }).unknown(false),
};

export const getHabitsSchema = {
  query: Joi.object({
    search: Joi.string().trim().optional(),
    isArchived: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(20),
  }).unknown(false),
};

export const habitIdSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

export const logHabitSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    date: Joi.date().iso().optional(),
    notes: Joi.string().trim().max(500).optional(),
  }).unknown(false),
};

export const unlogHabitSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    date: Joi.date().iso().optional(),
  }).unknown(false),
};

export const getLogsSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  query: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }).unknown(false),
};

export const getHeatmapSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  query: Joi.object({
    year: Joi.number().integer().min(2000).max(2100).optional(),
    month: Joi.number().integer().min(1).max(12).optional(),
  }).unknown(false),
};
