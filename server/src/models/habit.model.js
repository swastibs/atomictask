import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description too long"],
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [50, "Icon too long"],
    },
    color: {
      type: String,
      trim: true,
      maxlength: [20, "Color must be a hex code or short name"],
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    targetDays: {
      type: [Number],
      validate: {
        validator: function (days) {
          if (!days || days.length === 0) return true;
          return days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6);
        },
        message:
          "targetDays must be an array of integers from 0 (Sunday) to 6 (Saturday)",
      },
      default: undefined,
    },
    reminderTime: {
      type: String,
      trim: true,
      match: [
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Reminder time must be in HH:mm format",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

habitSchema.index({ user: 1, isArchived: 1, isActive: 1 });
habitSchema.index({ name: 1, user: 1 });

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
