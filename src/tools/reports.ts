import { z } from "zod";
import type { Report } from "@/endpoints/reports.js";
import { getReports } from "@/endpoints/reports.js";
import type { Tool } from "@/tools/types.js";

function formatAbuseReport(report: Report): string {
  return `- ${report.reportedAt} (${report.reporterCountryName ?? "Unknown"}): ${report.comment || "No comment"} [categories: ${report.categories.join(", ")}]`;
}

export const reportsTool: Tool = {
  name: "get_reports",
  description:
    "Get the individual abuse reports filed against an IP address — who reported it, why, and when.",
  inputSchema: {
    ip: z.string().describe("IPv4 or IPv6 address to get reports for"),
    max_age_in_days: z
      .number()
      .optional()
      .describe(
        "Only include reports from the last N days (1-365, default: 30)",
      ),
    page: z
      .number()
      .optional()
      .describe("Page number for pagination (default: 1)"),
    per_page: z.number().optional().describe("Reports per page (default: 25)"),
  },
  async handler(config, args) {
    const data = await getReports(
      config,
      args?.ip as string,
      (args?.max_age_in_days as number) ?? 30,
      (args?.page as number) ?? 1,
      (args?.per_page as number) ?? 25,
    );

    const lines = [
      `${data.total} total report(s), showing page ${data.page} of ${data.lastPage} (${data.count} on this page)`,
    ];

    if (data.results.length > 0) {
      lines.push("", ...data.results.map(formatAbuseReport));
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  },
};
