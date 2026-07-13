import { request } from "@/abuseipdbClient.js";
import type { Config } from "@/config.js";

export interface BlacklistEntry {
  ipAddress: string;
  abuseConfidenceScore: number;
  countryCode: string;
  lastReportedAt: string;
}

export async function getBlacklist(
  config: Config,
  limit: number = 25,
  confidenceMinimum: number = 100,
): Promise<BlacklistEntry[]> {
  const params = new URLSearchParams({
    // Free tier ignores any value here and always returns confidence 100 only —
    // paid tiers can lower this to widen results.
    confidenceMinimum: String(confidenceMinimum),
    limit: String(Math.min(limit, 10000)),
  });

  return request<BlacklistEntry[]>(config, "blacklist", params);
}
