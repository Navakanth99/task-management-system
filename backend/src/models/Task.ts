import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
      index: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
      index: true,
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
