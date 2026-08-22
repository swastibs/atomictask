import express from "express";
import { validate } from "express-validation";
import { authenticate } from "../middlewares/auth.js";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  restoreTask,
  bulkDeleteTasks,
  bulkUpdateTasks,
  getTaskStats,
  getTrashTasks,
  getSubtasks,
  permanentDeleteTask,
} from "../controllers/task.controller.js";

import {
  createTaskSchema,
  updateTaskSchema,
  getTasksSchema,
  getTaskSchema,
  deleteTaskSchema,
  restoreTaskSchema,
  permanentDeleteTaskSchema,
  getSubtasksSchema,
  bulkDeleteTasksSchema,
  bulkUpdateTasksSchema,
} from "../validations/task.validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ─── Statistics ───────────────────────────────────────────────
router.get("/stats", getTaskStats);

// ─── Trash ────────────────────────────────────────────────────
router.get("/trash", getTrashTasks);

// ─── Bulk operations ──────────────────────────────────────────
router.delete(
  "/bulk",
  validate(
    bulkDeleteTasksSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  bulkDeleteTasks,
);
router.patch(
  "/bulk",
  validate(
    bulkUpdateTasksSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  bulkUpdateTasks,
);

// ─── Sub‑tasks ────────────────────────────────────────────────
router.get(
  "/:id/subtasks",
  validate(getSubtasksSchema, {}, { abortEarly: false, stripUnknown: true }),
  getSubtasks,
);

// ─── Permanent delete ──────────────────────────────────────────
router.delete(
  "/:id/permanent",
  validate(
    permanentDeleteTaskSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  permanentDeleteTask,
);

// ─── Standard CRUD ────────────────────────────────────────────
router
  .route("/")
  .get(
    validate(getTasksSchema, {}, { abortEarly: false, stripUnknown: true }),
    getTasks,
  )
  .post(
    validate(createTaskSchema, {}, { abortEarly: false, stripUnknown: true }),
    createTask,
  );

router
  .route("/:id")
  .get(
    validate(getTaskSchema, {}, { abortEarly: false, stripUnknown: true }),
    getTask,
  )
  .put(
    validate(updateTaskSchema, {}, { abortEarly: false, stripUnknown: true }),
    updateTask,
  )
  .delete(
    validate(deleteTaskSchema, {}, { abortEarly: false, stripUnknown: true }),
    deleteTask,
  );

router.patch(
  "/:id/restore",
  validate(restoreTaskSchema, {}, { abortEarly: false, stripUnknown: true }),
  restoreTask,
);

export default router;
