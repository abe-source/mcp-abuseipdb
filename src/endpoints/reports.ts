import { request } from "@/abuseipdbClient.js";
import type { Config } from "@/config.js";

export interface Report {
  reportedAt: string;
  comment: string;
  categories: number[];
  reporterCountryName: string;
}

export interface ReportsResult {
  total: number;
  page: number;
  count: number;
  lastPage: number;
  results: Report[];
}

export async function getReports(
  config: Config,
  ip: string,
  maxAgeInDays: number = 30,
  page: number = 1,
  perPage: number = 25,
): Promise<ReportsResult> {
  const params = new URLSearchParams({
    ipAddress: ip,
    maxAgeInDays: String(maxAgeInDays),
    page: String(page),
    perPage: String(perPage),
  });

  return request<ReportsResult>(config, "reports", params);
}
