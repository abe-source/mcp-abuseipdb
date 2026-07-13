import { request } from "@/abuseipdbClient.js";
import type { Config } from "@/config.js";

export interface CheckIpResult {
  ipAddress: string;
  abuseConfidenceScore: number;
  countryCode: string;
  usageType: string;
  isp: string;
  isWhitelisted: boolean;
  totalReports: number;
  numDistinctUsers: number;
  lastReportedAt: string | null;
  reports?: { reportedAt: string; comment: string }[];
}

export async function checkIp(
  config: Config,
  ip: string,
  maxAgeInDays: number = 90,
  verbose: boolean = false,
): Promise<CheckIpResult> {
  const params = new URLSearchParams({
    ipAddress: ip,
    maxAgeInDays: String(maxAgeInDays),
  });

  if (verbose) {
    params.set("verbose", "1");
  }

  return request<CheckIpResult>(config, "check", params);
}
