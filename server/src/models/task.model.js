import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description too long"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled", "archived"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value === null || value === undefined || value >= new Date();
        },
        message: "Due date cannot be in the past",
      },
    },
    estimatedTime: { type: Number, min: 0, default: 0 },
    actualTime: { type: Number, min: 0, default: 0 },
    tags: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        body: { type: String, required: true, trim: true, maxlength: 2000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    activity: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        action: { type: String, required: true, maxlength: 80 },
        metadata: { type: mongoose.Schema.Types.Mixed, default: undefined },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

taskSchema.index({ user: 1, isDeleted: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ assignees: 1, isDeleted: 1 });
taskSchema.index({ title: "text", description: "text", tags: "text" });

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;
