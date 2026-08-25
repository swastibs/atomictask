import Habit from "../models/habit.model.js";
import HabitLog from "../models/habitLog.model.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.js";

// ---------- Helper: Date utilities (UTC) ----------
const startOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

// ---------- Streak Helpers ----------
const calculateCurrentStreak = async (
  userId,
  habitId,
  frequency,
  targetDays,
) => {
  if (frequency === "daily") {
    let streak = 0;
    let currentDate = startOfDay(new Date());

    while (true) {
      const log = await HabitLog.findOne({
        habit: habitId,
        date: currentDate,
        user: userId,
      });

      if (log && log.completed) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else {
        break;
      }
    }
    return streak;
  } else if (frequency === "weekly") {
    let streak = 0;
    let currentDate = startOfDay(new Date());

    while (true) {
      const dayOfWeek = currentDate.getUTCDay();
      if (targetDays.includes(dayOfWeek)) {
        const log = await HabitLog.findOne({
          habit: habitId,
          date: currentDate,
          user: userId,
        });
        if (log && log.completed) {
          streak++;
        } else {
          break;
        }
      }
      currentDate = addDays(currentDate, -1);
    }
    return streak;
  }
  return 0;
};

const calculateLongestStreak = async (userId, habitId) => {
  const logs = await HabitLog.find({
    habit: habitId,
    user: userId,
    completed: true,
  }).sort({ date: 1 });

  if (logs.length === 0) return 0;

  let longest = 0;
  let current = 1;
  for (let i = 1; i < logs.length; i++) {
    const prevDate = startOfDay(logs[i - 1].date);
    const currDate = startOfDay(logs[i].date);
    const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current++;
    } else if (diffDays > 1) {
      longest = Math.max(longest, current);
      current = 1;
    }
  }
  longest = Math.max(longest, current);
  return longest;
};

// ---------- Controller Functions ----------

// POST /habits
export const createHabit = catchAsync(async (req, res) => {
  const data = req.body;

  if (
    data.frequency === "weekly" &&
    (!data.targetDays || data.targetDays.length === 0)
  ) {
    throw new ApiError(
      400,
      "Weekly habits must specify at least one target day",
    );
  }

  const habit = await Habit.create({
    ...data,
    user: req.user.id,
  });

  return successResponse(res, {
    statusCode: 201,
    message: "Habit created successfully",
    data: habit,
  });
});

// GET /habits
export const getHabits = catchAsync(async (req, res) => {
  const query = { user: req.user.id };

  // Only apply filters if the query parameter is present
  if (req.query.isArchived !== undefined) {
    query.isArchived = req.query.isArchived === "true";
  }

  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === "true";
  }

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [habits, total] = await Promise.all([
    Habit.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Habit.countDocuments(query),
  ]);

  return successResponse(res, {
    message: "Habits retrieved successfully",
    data: { habits, total, page, limit },
  });
});

// GET /habits/today
export const getTodayProgress = catchAsync(async (req, res) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const habits = await Habit.find({
    user: req.user.id,
    isActive: true,
    isArchived: false,
  });

  const logs = await HabitLog.find({
    user: req.user.id,
    date: { $gte: todayStart, $lte: todayEnd },
  }).select("habit completed");

  const logMap = new Map();
  logs.forEach((log) => {
    logMap.set(log.habit.toString(), log.completed);
  });

  const result = habits.map((habit) => ({
    _id: habit._id,
    name: habit.name,
    icon: habit.icon,
    color: habit.color,
    frequency: habit.frequency,
    targetDays: habit.targetDays,
    completedToday: logMap.get(habit._id.toString()) || false,
  }));

  return successResponse(res, {
    message: "Today's progress retrieved successfully",
    data: result,
  });
});

// GET /habits/:id
export const getHabit = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  return successResponse(res, {
    message: "Habit retrieved successfully",
    data: habit,
  });
});

// PUT /habits/:id
export const updateHabit = catchAsync(async (req, res) => {
  const updateData = req.body;

  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  // Prevent changing user
  delete updateData.user;

  // Validate weekly targetDays
  if (updateData.frequency === "weekly") {
    if (!updateData.targetDays || updateData.targetDays.length === 0) {
      throw new ApiError(
        400,
        "Weekly habits must have at least one target day",
      );
    }
  }

  Object.assign(habit, updateData);
  await habit.save();

  return successResponse(res, {
    message: "Habit updated successfully",
    data: habit,
  });
});

// DELETE /habits/:id
export const deleteHabit = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  await HabitLog.deleteMany({ habit: req.params.id, user: req.user.id });
  await habit.deleteOne();

  return successResponse(res, {
    message: "Habit deleted successfully",
    data: { deleted: true },
  });
});

// PATCH /habits/:id/archive
export const archiveHabit = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  habit.isArchived = !habit.isArchived;
  await habit.save();

  return successResponse(res, {
    message: habit.isArchived ? "Habit archived" : "Habit unarchived",
    data: habit,
  });
});

// POST /habits/:id/log
export const logHabit = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  const date = req.body.date ? new Date(req.body.date) : new Date();
  const notes = req.body.notes || null;
  const targetDate = startOfDay(date);

  const existingLog = await HabitLog.findOne({
    habit: req.params.id,
    date: targetDate,
    user: req.user.id,
  });

  let log;
  if (existingLog) {
    if (!existingLog.completed) {
      existingLog.completed = true;
    }
    if (notes !== undefined && notes !== null) {
      existingLog.notes = notes;
    }
    await existingLog.save();
    log = existingLog;
  } else {
    log = await HabitLog.create({
      habit: req.params.id,
      date: targetDate,
      completed: true,
      notes: notes || undefined,
      user: req.user.id,
    });
  }

  return successResponse(res, {
    message: "Habit logged successfully",
    data: log,
  });
});

// DELETE /habits/:id/unlog
export const unlogHabit = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  const date = req.body.date ? new Date(req.body.date) : new Date();
  const targetDate = startOfDay(date);

  const result = await HabitLog.deleteOne({
    habit: req.params.id,
    date: targetDate,
    user: req.user.id,
  });

  return successResponse(res, {
    message: "Habit unlogged successfully",
    data: { deleted: result.deletedCount > 0 },
  });
});

// GET /habits/:id/logs
export const getLogs = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  const { startDate, endDate } = req.query;
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  const end = endDate ? new Date(endDate) : new Date();

  const logs = await HabitLog.find({
    habit: req.params.id,
    user: req.user.id,
    date: {
      $gte: startOfDay(start),
      $lte: endOfDay(end),
    },
  }).sort({ date: 1 });

  return successResponse(res, {
    message: "Habit logs retrieved successfully",
    data: logs,
  });
});

// GET /habits/:id/stats
export const getStats = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  const totalLogs = await HabitLog.countDocuments({
    habit: req.params.id,
    user: req.user.id,
  });

  const thirtyDaysAgo = startOfDay(addDays(new Date(), -29));
  const logsLast30 = await HabitLog.countDocuments({
    habit: req.params.id,
    user: req.user.id,
    date: { $gte: thirtyDaysAgo },
  });

  const completionRate =
    totalLogs > 0 ? Math.round((logsLast30 / 30) * 100) : 0;

  const currentStreak = await calculateCurrentStreak(
    req.user.id,
    req.params.id,
    habit.frequency,
    habit.targetDays || [],
  );

  const longestStreak = await calculateLongestStreak(
    req.user.id,
    req.params.id,
  );

  return successResponse(res, {
    message: "Habit statistics retrieved successfully",
    data: {
      totalLogs,
      logsLast30,
      completionRate,
      currentStreak,
      longestStreak,
    },
  });
});

// GET /habits/:id/heatmap
export const getHeatmap = catchAsync(async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!habit) {
    throw new ApiError(404, "Habit not found");
  }

  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));

  const logs = await HabitLog.find({
    habit: req.params.id,
    user: req.user.id,
    date: { $gte: start, $lte: end },
  }).select("date completed");

  const logMap = new Map();
  logs.forEach((log) => {
    const key = log.date.toISOString().slice(0, 10);
    logMap.set(key, log.completed);
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const heatmap = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month - 1, day));
    const key = date.toISOString().slice(0, 10);
    heatmap.push({
      date: key,
      completed: logMap.get(key) || false,
    });
  }

  return successResponse(res, {
    message: "Heatmap data retrieved successfully",
    data: heatmap,
  });
});
