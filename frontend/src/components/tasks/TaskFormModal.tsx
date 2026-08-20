import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { createTask, updateTask } from "@/services/taskService";
import type { Task, TaskStatus, TaskPriority } from "@/types";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  task?: Task | null;
}

const statusOptions: {
  value: TaskStatus;
  label: string;
}[] = [
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const priorityOptions: {
  value: TaskPriority;
  label: string;
}[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export function TaskFormModal({
  open,
  onClose,
  onSaved,
  task,
}: TaskFormModalProps) {
  const isEdit = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
  }>({});

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStatus(task?.status ?? "TODO");
      setPriority(task?.priority ?? "MEDIUM");

      // MongoDB/API field
      setDueDate(task?.dueDate ? task.dueDate.substring(0, 10) : "");

      setErrors({});
      setServerError("");
    }
  }, [open, task]);

  const validate = () => {
    const next: typeof errors = {};

    if (!title.trim()) {
      next.title = "Title is required";
    } else if (title.trim().length > 200) {
      next.title = "Title must be 200 characters or fewer";
    }

    if (dueDate) {
      const d = new Date(dueDate + "T00:00:00");

      if (isNaN(d.getTime())) {
        next.dueDate = "Enter a valid date";
      }
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
      };

      if (isEdit && task) {
        await updateTask(task._id, payload);
      } else {
        await createTask(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Unable to save task.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Task" : "Create Task"}
      description={
        isEdit
          ? "Update the details of your task."
          : "Add a new task to your list."
      }
      footer={
        <>
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading && <Spinner />}
            {loading ? "Saving..." : "Save Task"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            {serverError}
          </p>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="task-title"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title <span className="text-red-500">*</span>
          </label>

          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. Finish quarterly report"
            className={`input ${
              errors.title
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
            autoFocus
          />

          {errors.title && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-desc"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>

          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Optional notes about this task"
            className="input resize-none"
          />
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-status"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>

            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="input"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="input"
            >
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="task-due"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Due Date
          </label>

          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`input ${
              errors.dueDate
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
          />

          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.dueDate}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
