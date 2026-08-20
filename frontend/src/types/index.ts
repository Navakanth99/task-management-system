export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  _id: string;
  userId: string;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalyticsResponse {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;

  statusBreakdown: {
    todo: number;
    inProgress: number;
    done: number;
  };

  priorityBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export type SortField = "due_date" | "priority" | "created_at";
export type SortOrder = "asc" | "desc";
