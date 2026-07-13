import { z } from "zod";
import type { BlacklistEntry } from "@/endpoints/getBlacklist.js";
import { getBlacklist } from "@/endpoints/getBlacklist.js";
import type { Tool } from "@/tools/types.js";

function formatBlacklistEntry(entry: BlacklistEntry, index: number): string {
  return `${index + 1}. ${entry.ipAddress} — score: ${entry.abuseConfidenceScore}/100, country: ${entry.countryCode ?? "?"}, last reported: ${entry.lastReportedAt}`;
}

export const getBlacklistTool: Tool = {
  name: "get_blacklist",
  description:
    "Get the most reported IP addresses. Free tier only returns confidence 100 results regardless of confidence_minimum; paid tiers can widen the range.",
  inputSchema: {
    limit: z
      .number()
      .optional()
      .describe("Number of IPs to return (default: 25, max: 10000)"),
    confidence_minimum: z
      .number()
      .optional()
      .describe(
        "Minimum abuse confidence score, 0-100 (default: 100). Free tier ignores this and always returns 100 only.",
      ),
  },
  async handler(config, args) {
    const data = await getBlacklist(
      config,
      (args?.limit as number) ?? 25,
      (args?.confidence_minimum as number) ?? 100,
    );

    const lines = [
      `Top ${data.length} reported IPs:`,
      "",
      ...data.map(formatBlacklistEntry),
    ];

    return { content: [{ type: "text", text: lines.join("\n") }] };
  },
};
