import mongoose from "mongoose";
import { Task, TaskPriority, TaskStatus } from "../models/Task.js";

interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

interface GetTasksOptions {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const createTask = async ({
  userId,
  title,
  description,
  status,
  priority,
  dueDate,
}: CreateTaskInput) => {
  const task = await Task.create({
    userId,
    title,
    description,
    status,
    priority,
    dueDate,
  });

  return task;
};

export const getTasks = async ({
  userId,
  status,
  priority,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
}: GetTasksOptions) => {
  const query: Record<string, unknown> = {
    userId,
  };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "dueDate",
    "title",
    "priority",
    "status",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sort: Record<string, 1 | -1> = {
    [safeSortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sort).skip(skip).limit(limit),

    Task.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (taskId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput,
) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const deleteTask = async (taskId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await Task.findOneAndDelete({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};
