import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { successResponse } from "../utils/response.js";

const isAdmin = (user) => user.role === "admin";
const accessFilter = (user) =>
  isAdmin(user)
    ? { isDeleted: false }
    : { isDeleted: false, $or: [{ user: user.id }, { assignees: user.id }] };
const canWrite = (task, user) =>
  isAdmin(user) ||
  String(task.user) === String(user.id) ||
  task.assignees.some((id) => String(id) === String(user.id));

const validateAssignees = async (ids) => {
  const uniqueIds = [...new Set((ids || []).map(String))];
  if (!uniqueIds.length) return [];
  const count = await User.countDocuments({
    _id: { $in: uniqueIds },
    isActive: true,
    isDeleted: false,
  });
  if (count !== uniqueIds.length)
    throw new ApiError(400, "One or more assignees are invalid");
  return uniqueIds;
};

const activity = (actor, action, metadata = undefined) => ({
  actor,
  action,
  metadata,
});
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizePriority = (value) => (value === "URGENT" ? "urgent" : value);
const normalizeStatus = (value) =>
  ({
    TODO: "pending",
    IN_PROGRESS: "in-progress",
    DONE: "completed",
    CANCELLED: "cancelled",
  })[value] || value;

// ============================================================
// Helper: verify parentTask ownership & prevent cycles
// ============================================================
const validateParentTask = async (userId, taskId, parentTaskId) => {
  if (!parentTaskId) return;

  // Prevent self‑reference
  if (taskId && String(parentTaskId) === String(taskId)) {
    throw new ApiError(400, "parentTask cannot reference itself");
  }

  // Check that the parent exists and belongs to this user
  let current = await Task.findOne({
    _id: parentTaskId,
    user: userId,
    isDeleted: false,
  }).select("parentTask");

  if (!current) {
    throw new ApiError(
      400,
      "parentTask must reference an existing task you own",
    );
  }

  // Walk up the chain to detect cycles
  const visited = new Set();
  while (current) {
    const currentId = String(current._id);

    if (taskId && currentId === String(taskId)) {
      throw new ApiError(400, "parentTask would create a cycle");
    }

    if (visited.has(currentId)) {
      throw new ApiError(400, "parentTask hierarchy contains a cycle");
    }

    visited.add(currentId);

    if (!current.parentTask) break;

    current = await Task.findOne({
      _id: current.parentTask,
      user: userId,
      isDeleted: false,
    }).select("parentTask");
  }
};

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
    assignees,
  } = req.body;

  // Validate parentTask if provided
  if (parentTask) {
    await validateParentTask(req.user.id, null, parentTask);
  }
  const validatedAssignees = await validateAssignees(assignees);

  const task = new Task({
    title,
    description,
    priority: normalizePriority(priority),
    dueDate,
    estimatedTime,
    tags,
    parentTask,
    assignees: validatedAssignees,
    activity: [activity(req.user.id, "created")],
    user: req.user.id,
    // status defaults to "pending" so no need to set completedAt
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
  const {
    status,
    priority,
    dueDate,
    search,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
    assignedTo,
  } = req.query;

  const query = accessFilter(req.user);

  if (status) query.status = normalizeStatus(status);
  if (priority) query.priority = normalizePriority(priority);
  if (assignedTo) query.assignees = assignedTo;
  if (search)
    query.$and = [
      {
        $or: [
          { title: { $regex: escapeRegex(search), $options: "i" } },
          { description: { $regex: escapeRegex(search), $options: "i" } },
          { tags: { $regex: escapeRegex(search), $options: "i" } },
        ],
      },
    ];

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

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const [tasks, total] = await Promise.all([
    Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("assignees", "name username email"),
    Task.countDocuments(query),
  ]);

  return successResponse(res, {
    message: "Tasks retrieved successfully",
    data: tasks,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Get a single task by ID
 * GET /api/tasks/:id
 */
export const getTask = catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    ...accessFilter(req.user),
  })
    .populate("parentTask", "_id title")
    .populate("assignees", "name username email");

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
    ...accessFilter(req.user),
  });
  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }
  if (!canWrite(existingTask, req.user))
    throw new ApiError(403, "You cannot modify this task");

  if (Object.keys(req.body).length === 0) {
    throw new ApiError(400, "At least one field is required for update");
  }

  // Allowed fields
  const allowedFields = [
    "title",
    "description",
    "priority",
    "status",
    "dueDate",
    "estimatedTime",
    "assignees",
    "actualTime",
    "tags",
    "parentTask",
  ];
  const filteredUpdate = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredUpdate[field] =
        field === "priority"
          ? normalizePriority(updateData[field])
          : field === "status"
            ? normalizeStatus(updateData[field])
            : updateData[field];
    }
  });

  // Validate parentTask if it is being changed
  if (filteredUpdate.parentTask !== undefined) {
    await validateParentTask(req.user.id, id, filteredUpdate.parentTask);
  }
  if (filteredUpdate.assignees !== undefined) {
    filteredUpdate.assignees = await validateAssignees(
      filteredUpdate.assignees,
    );
  }

  // Manually manage completedAt when status changes
  if (filteredUpdate.status === "completed" && !existingTask.completedAt) {
    filteredUpdate.completedAt = new Date();
  }
  if (filteredUpdate.status && filteredUpdate.status !== "completed") {
    filteredUpdate.completedAt = null;
  }
  filteredUpdate.$push = {
    activity: activity(req.user.id, "updated", {
      fields: Object.keys(filteredUpdate),
    }),
  };

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
    ...accessFilter(req.user),
  });
  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }
  if (!canWrite(existingTask, req.user))
    throw new ApiError(403, "You cannot delete this task");

  const childCount = await Task.countDocuments({
    parentTask: id,
    user: req.user.id,
    isDeleted: false,
  });
  if (childCount > 0) {
    throw new ApiError(400, "Task with active subtasks cannot be deleted");
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

  if (task.parentTask) {
    const parent = await Task.findOne({
      _id: task.parentTask,
      user: req.user.id,
      isDeleted: false,
    });
    if (!parent) {
      throw new ApiError(
        400,
        "Restore the parent task before restoring this task",
      );
    }
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
  const { ids } = req.body || {}; // <-- fallback to empty object

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of task IDs");
  }

  const tasks = await Task.find({
    _id: { $in: ids },
    ...accessFilter(req.user),
  });
  if (!isAdmin(req.user) && tasks.some((task) => !canWrite(task, req.user))) {
    throw new ApiError(403, "You cannot delete one or more selected tasks");
  }
  const childCount = await Task.countDocuments({
    parentTask: { $in: ids },
    ...accessFilter(req.user),
  });
  if (childCount > 0) {
    throw new ApiError(400, "Tasks with active subtasks cannot be deleted");
  }

  const result = await Task.updateMany(
    {
      _id: { $in: ids },
      ...accessFilter(req.user),
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

export const bulkUpdateTasks = catchAsync(async (req, res) => {
  const { ids, updateData } = req.body || {}; // <-- fallback to empty object

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
    "assignees",
  ];
  const filteredUpdate = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredUpdate[field] =
        field === "priority"
          ? normalizePriority(updateData[field])
          : field === "status"
            ? normalizeStatus(updateData[field])
            : updateData[field];
    }
  });

  if (Object.keys(filteredUpdate).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }
  const tasks = await Task.find({
    _id: { $in: ids },
    ...accessFilter(req.user),
  });
  if (!isAdmin(req.user) && tasks.some((task) => !canWrite(task, req.user))) {
    throw new ApiError(403, "You cannot update one or more selected tasks");
  }
  if (filteredUpdate.assignees !== undefined) {
    filteredUpdate.assignees = await validateAssignees(
      filteredUpdate.assignees,
    );
  }

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
      ...accessFilter(req.user),
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

  const childCount = await Task.countDocuments({
    parentTask: id,
    user: req.user.id,
  });
  if (childCount > 0) {
    throw new ApiError(400, "Task with subtasks cannot be permanently deleted");
  }

  await Task.findByIdAndDelete(id);

  return successResponse(res, {
    message: "Task permanently deleted",
    data: null,
  });
});

const findWritableTask = async (req) => {
  const task = await Task.findOne({
    _id: req.params.id,
    ...accessFilter(req.user),
  });
  if (!task) throw new ApiError(404, "Task not found");
  if (!canWrite(task, req.user))
    throw new ApiError(403, "You cannot modify this task");
  return task;
};

export const addComment = catchAsync(async (req, res) => {
  const task = await findWritableTask(req);
  task.comments.push({ author: req.user.id, body: req.body.body });
  task.activity.push(activity(req.user.id, "commented"));
  await task.save();
  const comment = task.comments[task.comments.length - 1];
  return successResponse(res, {
    statusCode: 201,
    message: "Comment added successfully",
    data: comment,
  });
});

export const getComments = catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    ...accessFilter(req.user),
  }).populate("comments.author", "name username");
  if (!task) throw new ApiError(404, "Task not found");
  return successResponse(res, {
    message: "Comments retrieved successfully",
    data: task.comments,
  });
});

export const addAssignees = catchAsync(async (req, res) => {
  const task = await findWritableTask(req);
  const ids = await validateAssignees(req.body.userIds);
  task.assignees = [...new Set([...task.assignees.map(String), ...ids])];
  task.activity.push(activity(req.user.id, "assigned", { userIds: ids }));
  await task.save();
  return successResponse(res, {
    message: "Assignees updated successfully",
    data: task.assignees,
  });
});

export const removeAssignee = catchAsync(async (req, res) => {
  const task = await findWritableTask(req);
  task.assignees = task.assignees.filter(
    (id) => String(id) !== req.params.userId,
  );
  task.activity.push(
    activity(req.user.id, "unassigned", { userId: req.params.userId }),
  );
  await task.save();
  return successResponse(res, {
    message: "Assignee removed successfully",
    data: task.assignees,
  });
});
