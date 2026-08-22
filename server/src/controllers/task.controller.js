import Task from "../models/task.model.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/response.js";

// ============================================================
// 1. STANDARD CRUD
// ============================================================

/**
 * Create a new task
 * POST /api/tasks
 */
export const createTask = catchAsync(async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
    estimatedTime,
    tags,
    parentTask,
  } = req.body;

  const task = new Task({
    title,
    description,
    priority,
    dueDate,
    estimatedTime,
    tags,
    parentTask,
    user: req.user.id,
  });

  await task.save();

  return successResponse(res, {
    statusCode: 201,
    message: "Task created successfully",
    data: task,
  });
});

/**
 * Get all tasks (with optional filters)
 * GET /api/tasks?status=&priority=&dueDate=
 */
export const getTasks = catchAsync(async (req, res) => {
  const { status, priority, dueDate } = req.query;

  const query = { user: req.user.id, isDeleted: false };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (dueDate) {
    const date = new Date(dueDate);
    if (!isNaN(date)) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: start, $lte: end };
    }
  }

  const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });

  return successResponse(res, {
    message: "Tasks retrieved successfully",
    data: tasks,
  });
});

/**
 * Get a single task by ID
 * GET /api/tasks/:id
 */
export const getTask = catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
    isDeleted: false,
  }).populate("parentTask", "_id title");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return successResponse(res, {
    message: "Task retrieved successfully",
    data: task,
  });
});

/**
 * Update a task (partial update)
 * PUT /api/tasks/:id
 */
export const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Verify ownership and existence
  const existingTask = await Task.findOne({
    _id: id,
    user: req.user.id,
    isDeleted: false,
  });
  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  // Allowed fields
  const allowedFields = [
    "title",
    "description",
    "priority",
    "status",
    "dueDate",
    "estimatedTime",
    "actualTime",
    "tags",
    "parentTask",
  ];
  const filteredUpdate = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredUpdate[field] = updateData[field];
    }
  });

  const updatedTask = await Task.findByIdAndUpdate(id, filteredUpdate, {
    new: true,
    runValidators: true,
  });

  return successResponse(res, {
    message: "Task updated successfully",
    data: updatedTask,
  });
});

/**
 * Soft delete a task
 * DELETE /api/tasks/:id
 */
export const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;

  const existingTask = await Task.findOne({
    _id: id,
    user: req.user.id,
    isDeleted: false,
  });
  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  const deletedTask = await Task.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id },
    { new: true },
  );

  return successResponse(res, {
    message: "Task deleted successfully",
    data: deletedTask,
  });
});

/**
 * Restore a soft-deleted task
 * PATCH /api/tasks/:id/restore
 */
export const restoreTask = catchAsync(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({
    _id: id,
    user: req.user.id,
    isDeleted: true,
  });
  if (!task) {
    throw new ApiError(404, "Task not found or not deleted");
  }

  task.isDeleted = false;
  task.deletedAt = null;
  task.deletedBy = null;
  await task.save();

  return successResponse(res, {
    message: "Task restored successfully",
    data: task,
  });
});

// ============================================================
// 2. BULK OPERATIONS
// ============================================================

/**
 * Soft delete multiple tasks at once
 * DELETE /api/tasks/bulk
 * Body: { ids: ["id1", "id2"] }
 */
export const bulkDeleteTasks = catchAsync(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of task IDs");
  }

  const result = await Task.updateMany(
    {
      _id: { $in: ids },
      user: req.user.id,
      isDeleted: false,
    },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user.id,
    },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "No valid tasks found to delete");
  }

  return successResponse(res, {
    message: `${result.modifiedCount} task(s) deleted successfully`,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    },
  });
});

/**
 * Bulk update multiple tasks (status, priority, etc.)
 * PATCH /api/tasks/bulk
 * Body: { ids: ["id1", "id2"], updateData: { status: "completed" } }
 */
export const bulkUpdateTasks = catchAsync(async (req, res) => {
  const { ids, updateData } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of task IDs");
  }
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new ApiError(400, "Please provide update data");
  }

  const allowedFields = [
    "priority",
    "status",
    "tags",
    "dueDate",
    "estimatedTime",
  ];
  const filteredUpdate = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredUpdate[field] = updateData[field];
    }
  });

  if (Object.keys(filteredUpdate).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  // If status is updated, handle completedAt manually (because updateMany bypasses pre‑save)
  if (filteredUpdate.status === "completed") {
    filteredUpdate.completedAt = new Date();
  }
  if (
    filteredUpdate.status !== "completed" &&
    filteredUpdate.status !== undefined
  ) {
    filteredUpdate.completedAt = null;
  }

  const result = await Task.updateMany(
    {
      _id: { $in: ids },
      user: req.user.id,
      isDeleted: false,
    },
    filteredUpdate,
    { runValidators: true },
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "No valid tasks found to update");
  }

  return successResponse(res, {
    message: `${result.modifiedCount} task(s) updated successfully`,
    data: {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    },
  });
});

// ============================================================
// 3. STATISTICS & TRASH
// ============================================================

/**
 * Get task statistics for the authenticated user
 * GET /api/tasks/stats
 */
export const getTaskStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [
    total,
    pending,
    inProgress,
    completed,
    archived,
    totalDeleted,
    overdue,
    completedToday,
  ] = await Promise.all([
    Task.countDocuments({ user: userId, isDeleted: false }),
    Task.countDocuments({ user: userId, isDeleted: false, status: "pending" }),
    Task.countDocuments({
      user: userId,
      isDeleted: false,
      status: "in-progress",
    }),
    Task.countDocuments({
      user: userId,
      isDeleted: false,
      status: "completed",
    }),
    Task.countDocuments({ user: userId, isDeleted: false, status: "archived" }),
    Task.countDocuments({ user: userId, isDeleted: true }),
    Task.countDocuments({
      user: userId,
      isDeleted: false,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    }),
    Task.countDocuments({
      user: userId,
      isDeleted: false,
      status: "completed",
      completedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }),
  ]);

  return successResponse(res, {
    message: "Task statistics retrieved successfully",
    data: {
      total,
      pending,
      inProgress,
      completed,
      archived,
      deleted: totalDeleted,
      overdue,
      completedToday,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    },
  });
});

/**
 * Get all soft‑deleted tasks (trash)
 * GET /api/tasks/trash
 */
export const getTrashTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find({
    user: req.user.id,
    isDeleted: true,
  })
    .sort({ deletedAt: -1 })
    .populate("parentTask", "_id title");

  return successResponse(res, {
    message: "Deleted tasks retrieved successfully",
    data: tasks,
  });
});

// ============================================================
// 4. SUB‑TASKS
// ============================================================

/**
 * Get all sub‑tasks for a given parent task
 * GET /api/tasks/:id/subtasks
 */
export const getSubtasks = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Verify parent exists and belongs to user
  const parent = await Task.findOne({
    _id: id,
    user: req.user.id,
    isDeleted: false,
  });
  if (!parent) {
    throw new ApiError(404, "Parent task not found");
  }

  const subtasks = await Task.find({
    parentTask: id,
    user: req.user.id,
    isDeleted: false,
  }).sort({ createdAt: 1 });

  return successResponse(res, {
    message: "Sub‑tasks retrieved successfully",
    data: subtasks,
  });
});

// ============================================================
// 5. PERMANENT DELETE (Hard Delete)
// ============================================================

/**
 * Permanently delete a task (hard delete)
 * DELETE /api/tasks/:id/permanent
 */
export const permanentDeleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({
    _id: id,
    user: req.user.id,
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Safety: uncomment below to only allow permanent deletion of already‑deleted tasks
  // if (!task.isDeleted) {
  //   throw new ApiError(400, "Task must be soft‑deleted first before permanent removal");
  // }

  await Task.findByIdAndDelete(id);

  return successResponse(res, {
    message: "Task permanently deleted",
    data: null,
  });
});
