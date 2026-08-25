import express from "express";
import { validate } from "express-validation";
import { authenticate } from "../middlewares/auth.js";
import * as habitController from "../controllers/habit.controller.js";
import * as habitValidation from "../validations/habit.validation.js";

const router = express.Router();

// All habit routes require authentication
router.use(authenticate);

// --- Today's progress (must come before /:id to avoid conflict) ---
router.get("/today", habitController.getTodayProgress);

// --- CRUD ---
router
  .route("/")
  .get(
    validate(
      habitValidation.getHabitsSchema,
      {},
      { abortEarly: false, stripUnknown: true },
    ),
    habitController.getHabits,
  )
  .post(
    validate(
      habitValidation.createHabitSchema,
      {},
      { abortEarly: false, stripUnknown: true },
    ),
    habitController.createHabit,
  );

router
  .route("/:id")
  .get(
    validate(
      habitValidation.habitIdSchema,
      {},
      { abortEarly: false, stripUnknown: true },
    ),
    habitController.getHabit,
  )
  .put(
    validate(
      habitValidation.updateHabitSchema,
      {},
      { abortEarly: false, stripUnknown: true },
    ),
    habitController.updateHabit,
  )
  .delete(
    validate(
      habitValidation.habitIdSchema,
      {},
      { abortEarly: false, stripUnknown: true },
    ),
    habitController.deleteHabit,
  );

// --- Archive toggle ---
router.patch(
  "/:id/archive",
  validate(
    habitValidation.habitIdSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  habitController.archiveHabit,
);

// --- Logging ---
router.post(
  "/:id/log",
  validate(
    habitValidation.logHabitSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  habitController.logHabit,
);

router.delete(
  "/:id/unlog",
  validate(
    habitValidation.unlogHabitSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  habitController.unlogHabit,
);

// --- History & Stats ---
router.get(
  "/:id/logs",
  validate(
    habitValidation.getLogsSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  habitController.getLogs,
);

router.get(
  "/:id/stats",
  validate(
    habitValidation.habitIdSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  habitController.getStats,
);

router.get(
  "/:id/heatmap",
  validate(
    habitValidation.getHeatmapSchema,
    {},
    { abortEarly: false, stripUnknown: true },
  ),
  habitController.getHeatmap,
);

export default router;
