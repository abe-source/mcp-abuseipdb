import { request } from "@/abuseipdbClient.js";
import type { Config } from "@/config.js";

export interface CheckBlockResult {
  networkAddress: string;
  netmask: string;
  minAddress: string;
  maxAddress: string;
  numPossibleHosts: number;
  addressSpaceDesc: string;
  reportedAddress: {
    ipAddress: string;
    numReports: number;
    mostRecentReport: string;
    abuseConfidenceScore: number;
    countryCode: string;
  }[];
}

export async function checkBlock(
  config: Config,
  network: string,
  maxAgeInDays: number = 30,
): Promise<CheckBlockResult> {
  const params = new URLSearchParams({
    network,
    maxAgeInDays: String(maxAgeInDays),
  });

  return request<CheckBlockResult>(config, "check-block", params);
}
