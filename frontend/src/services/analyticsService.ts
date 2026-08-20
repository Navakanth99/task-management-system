import { apiRequest } from "./api";
import type { AnalyticsResponse } from "@/types";

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const response = await apiRequest<{
    success: boolean;
    data: AnalyticsResponse;
  }>("/analytics");

  return response.data;
}
