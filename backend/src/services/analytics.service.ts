import mongoose from "mongoose";
import { Task } from "../models/Task.js";

export const getTaskAnalytics = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const objectUserId = new mongoose.Types.ObjectId(userId);

  // Status breakdown
  const statusResult = await Task.aggregate([
    {
      $match: {
        userId: objectUserId,
      },
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // Priority breakdown
  const priorityResult = await Task.aggregate([
    {
      $match: {
        userId: objectUserId,
      },
    },
    {
      $group: {
        _id: "$priority",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  let todo = 0;
  let inProgress = 0;
  let done = 0;

  for (const item of statusResult) {
    if (item._id === "TODO") {
      todo = item.count;
    }

    if (item._id === "IN_PROGRESS") {
      inProgress = item.count;
    }

    if (item._id === "DONE") {
      done = item.count;
    }
  }

  let low = 0;
  let medium = 0;
  let high = 0;

  for (const item of priorityResult) {
    if (item._id === "LOW") {
      low = item.count;
    }

    if (item._id === "MEDIUM") {
      medium = item.count;
    }

    if (item._id === "HIGH") {
      high = item.count;
    }
  }

  const totalTasks = todo + inProgress + done;

  const pendingTasks = todo + inProgress;

  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((done / totalTasks) * 100);

  return {
    totalTasks,
    completedTasks: done,
    pendingTasks,
    completionPercentage,

    statusBreakdown: {
      todo,
      inProgress,
      done,
    },

    priorityBreakdown: {
      low,
      medium,
      high,
    },
  };
};
