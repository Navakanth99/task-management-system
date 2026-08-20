import { apiRequest } from "./api";

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskResponse {
  success: boolean;
  message?: string;
  data: Task;
}

interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface GetTasksParams {
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  search?: string;
  sortBy?: "dueDate" | "priority" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const createTask = async (task: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}): Promise<Task> => {
  const response = await apiRequest<TaskResponse>("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

  return response.data;
};

export const getTasks = async (
  params: GetTasksParams = {},
): Promise<TasksResponse["data"]> => {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.priority) {
    searchParams.set("priority", params.priority);
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.set("sortOrder", params.sortOrder);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  const response = await apiRequest<TasksResponse>(
    `/tasks${query ? `?${query}` : ""}`,
  );

  return response.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await apiRequest<TaskResponse>(`/tasks/${id}`);

  return response.data;
};

export const updateTask = async (
  id: string,
  task: Partial<Task>,
): Promise<Task> => {
  const response = await apiRequest<TaskResponse>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiRequest(`/tasks/${id}`, {
    method: "DELETE",
  });
};
// Compatibility for existing frontend components
export const fetchTasks = getTasks;

// Compatibility for existing Tasks.tsx
export const updateTaskStatus = async (
  id: string,
  status: "TODO" | "IN_PROGRESS" | "DONE",
): Promise<Task> => {
  return updateTask(id, {
    status,
  });
};
