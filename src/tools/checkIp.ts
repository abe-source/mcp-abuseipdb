import { z } from "zod";
import { checkIp } from "@/endpoints/checkIp.js";
import type { Tool } from "@/tools/types.js";

function formatReport(report: { reportedAt: string; comment: string }): string {
  return `- ${report.reportedAt}: ${report.comment || "No comment"}`;
}

export const checkIpTool: Tool = {
  name: "check_ip",
  description:
    "Check if an IP address has been reported for abusive behavior. Returns abuse confidence score (0-100), ISP, country, usage type, and report count.",
  inputSchema: {
    ip: z.string().describe("IPv4 or IPv6 address to check"),
    max_age_in_days: z
      .number()
      .optional()
      .describe(
        "Only include reports from the last N days (1-365, default: 90)",
      ),
    verbose: z
      .boolean()
      .optional()
      .describe(
        "Include the last 10 individual abuse reports (default: false)",
      ),
  },
  async handler(config, args) {
    const data = await checkIp(
      config,
      args?.ip as string,
      (args?.max_age_in_days as number) ?? 90,
      (args?.verbose as boolean) ?? false,
    );

    const score = data.abuseConfidenceScore;
    const risk =
      score >= 75 ? "HIGH RISK" : score >= 25 ? "MEDIUM RISK" : "LOW RISK";

    const lines = [
      `IP: ${data.ipAddress}`,
      `Risk: ${risk} (confidence score: ${score}/100)`,
      `Country: ${data.countryCode ?? "Unknown"}`,
      `ISP: ${data.isp ?? "Unknown"}`,
      `Usage type: ${data.usageType ?? "Unknown"}`,
      `Total reports: ${data.totalReports} from ${data.numDistinctUsers} distinct users`,
      `Last reported: ${data.lastReportedAt ?? "Never"}`,
      `Whitelisted: ${data.isWhitelisted ? "Yes" : "No"}`,
    ];

    if (data.reports && data.reports.length > 0) {
      lines.push(
        "",
        "Recent reports:",
        ...data.reports.slice(0, 10).map(formatReport),
      );
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  },
};
