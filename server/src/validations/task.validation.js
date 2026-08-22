import { Joi } from "express-validation";

// ─── Custom validator for MongoDB ObjectId ──────────────────
const objectId = Joi.string().hex().length(24).messages({
  "string.hex": "Must be a valid ObjectId (hexadecimal)",
  "string.length": "Must be a valid ObjectId (24 characters)",
});

// ─── Reusable enums ──────────────────────────────────────────
const priorityEnum = ["low", "medium", "high"];
const statusEnum = ["pending", "in-progress", "completed", "archived"];

// ─── Schemas ──────────────────────────────────────────────────

export const createTaskSchema = {
  body: Joi.object({
    title: Joi.string().trim().max(200).required().messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.max": "Title cannot exceed 200 characters",
    }),
    description: Joi.string().trim().max(2000).optional().messages({
      "string.max": "Description cannot exceed 2000 characters",
    }),
    priority: Joi.string()
      .valid(...priorityEnum)
      .optional()
      .default("medium"),
    dueDate: Joi.date().iso().optional().messages({
      "date.base": "Due date must be a valid date",
      "date.format": "Due date must be in ISO format (YYYY-MM-DD)",
    }),
    estimatedTime: Joi.number().min(0).optional().default(0).messages({
      "number.base": "Estimated time must be a number",
      "number.min": "Estimated time cannot be negative",
    }),
    tags: Joi.array().items(Joi.string().trim()).optional().default([]),
    parentTask: objectId.optional().allow(null),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Unknown field provided",
    }),
};

export const updateTaskSchema = {
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "Task ID is required",
    }),
  }),
  body: Joi.object({
    title: Joi.string().trim().max(200).optional().messages({
      "string.max": "Title cannot exceed 200 characters",
    }),
    description: Joi.string().trim().max(2000).optional().messages({
      "string.max": "Description cannot exceed 2000 characters",
    }),
    priority: Joi.string()
      .valid(...priorityEnum)
      .optional(),
    status: Joi.string()
      .valid(...statusEnum)
      .optional(),
    dueDate: Joi.date().iso().optional().messages({
      "date.base": "Due date must be a valid date",
      "date.format": "Due date must be in ISO format (YYYY-MM-DD)",
    }),
    estimatedTime: Joi.number().min(0).optional().messages({
      "number.base": "Estimated time must be a number",
      "number.min": "Estimated time cannot be negative",
    }),
    actualTime: Joi.number().min(0).optional().messages({
      "number.base": "Actual time must be a number",
      "number.min": "Actual time cannot be negative",
    }),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    parentTask: objectId.optional().allow(null),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Unknown field provided",
    }),
};

export const getTasksSchema = {
  query: Joi.object({
    status: Joi.string()
      .valid(...statusEnum)
      .optional(),
    priority: Joi.string()
      .valid(...priorityEnum)
      .optional(),
    dueDate: Joi.date().iso().optional().messages({
      "date.base": "dueDate must be a valid date",
      "date.format": "dueDate must be in ISO format (YYYY-MM-DD)",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Unknown query parameter provided",
    }),
};

export const getTaskSchema = {
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "Task ID is required",
    }),
  }),
};

export const deleteTaskSchema = {
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "Task ID is required",
    }),
  }),
};

export const restoreTaskSchema = {
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "Task ID is required",
    }),
  }),
};

export const permanentDeleteTaskSchema = {
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "Task ID is required",
    }),
  }),
};

export const getSubtasksSchema = {
  params: Joi.object({
    id: objectId.required().messages({
      "any.required": "Parent task ID is required",
    }),
  }),
};

export const bulkDeleteTasksSchema = {
  body: Joi.object({
    ids: Joi.array().items(objectId.required()).min(1).required().messages({
      "array.base": "ids must be an array",
      "array.min": "At least one ID must be provided",
      "any.required": "ids is required",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Unknown field provided",
    }),
};

export const bulkUpdateTasksSchema = {
  body: Joi.object({
    ids: Joi.array().items(objectId.required()).min(1).required().messages({
      "array.base": "ids must be an array",
      "array.min": "At least one ID must be provided",
      "any.required": "ids is required",
    }),
    updateData: Joi.object({
      priority: Joi.string()
        .valid(...priorityEnum)
        .optional(),
      status: Joi.string()
        .valid(...statusEnum)
        .optional(),
      tags: Joi.array().items(Joi.string().trim()).optional(),
      dueDate: Joi.date().iso().optional().messages({
        "date.base": "dueDate must be a valid date",
        "date.format": "dueDate must be in ISO format (YYYY-MM-DD)",
      }),
      estimatedTime: Joi.number().min(0).optional().messages({
        "number.base": "estimatedTime must be a number",
        "number.min": "estimatedTime cannot be negative",
      }),
    })
      .min(1)
      .required()
      .messages({
        "object.base": "updateData must be an object",
        "object.min": "updateData must contain at least one field",
        "any.required": "updateData is required",
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Unknown field provided",
    }),
};
