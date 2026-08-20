import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { fetchAnalytics } from "@/services/analyticsService";
import { useTheme } from "@/context/ThemeContext";
import type { AnalyticsResponse } from "@/types";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";

const STATUS_COLORS: Record<string, string> = {
  TODO: "#9ca3af",
  IN_PROGRESS: "#3366ff",
  DONE: "#10b981",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#9ca3af",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
};

export default function Analytics() {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const a = await fetchAnalytics();
      setData(a);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const isDark = theme === "dark";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const tooltipBg = isDark ? "#111827" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  const statusData = data
    ? [
        {
          name: "Done",
          value: data.statusBreakdown.done,
          key: "DONE",
        },
        {
          name: "In Progress",
          value: data.statusBreakdown.inProgress,
          key: "IN_PROGRESS",
        },
        {
          name: "Todo",
          value: data.statusBreakdown.todo,
          key: "TODO",
        },
      ]
    : [];

  const priorityData = data
    ? [
        {
          name: "Low",
          value: data.priorityBreakdown.low,
          key: "LOW",
        },
        {
          name: "Medium",
          value: data.priorityBreakdown.medium,
          key: "MEDIUM",
        },
        {
          name: "High",
          value: data.priorityBreakdown.high,
          key: "HIGH",
        },
      ]
    : [];

  const stats = [
    {
      label: "Total Tasks",
      value: data?.totalTasks ?? 0,
      icon: ListTodo,
      color: "text-brand-600 dark:text-brand-400",
    },
    {
      label: "Completed",
      value: data?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "In Progress",
      value: data?.statusBreakdown.inProgress ?? 0,
      icon: Loader2,
      color: "text-brand-600 dark:text-brand-400",
    },
    {
      label: "Pending",
      value: data?.pendingTasks ?? 0,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Insights into your task activity.
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {s.label}
                  </p>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Completion progress */}
      {!loading && !error && data && (
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30">
              <TrendingUp className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Completion Rate
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Percentage of tasks you've finished
              </p>
            </div>
            <span className="ml-auto text-2xl font-bold text-brand-600 dark:text-brand-400">
              {data.completionPercentage}%
            </span>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${data.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card p-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className="card p-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>
      ) : error ? (
        <ErrorState message="Unable to load analytics." onRetry={load} />
      ) : data && data.totalTasks === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <ListTodo className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No data to show yet. Create some tasks to see analytics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Status distribution - donut */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Task Status Distribution
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Breakdown by status
            </p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value: string) => (
                      <span style={{ color: axisColor, fontSize: 13 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority distribution - bar */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Priority Distribution
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Breakdown by priority level
            </p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: axisColor, fontSize: 13 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    cursor={{ fill: isDark ? "#37415140" : "#f3f4f6" }}
                  />
                  <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
