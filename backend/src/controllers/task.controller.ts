import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createTask as createTaskService,
  getTasks as getTasksService,
  getTaskById as getTaskByIdService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "../services/task.service.js";

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Title is required",
      });
      return;
    }

    const task = await createTaskService({
      userId: req.user.userId,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create task",
    });
  }
};

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { status, priority, search, sortBy, sortOrder, page, limit } =
      req.query;

    const result = await getTasksService({
      userId: req.user.userId,
      status: status as any,
      priority: priority as any,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch tasks",
    });
  }
};

export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const task = await getTaskByIdService(taskId, req.user.userId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch task";

    res.status(message === "Task not found" ? 404 : 400).json({
      success: false,
      message,
    });
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const task = await updateTaskService(taskId, req.user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update task";

    res.status(message === "Task not found" ? 404 : 400).json({
      success: false,
      message,
    });
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await deleteTaskService(taskId, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete task";

    res.status(message === "Task not found" ? 404 : 400).json({
      success: false,
      message,
    });
  }
};
