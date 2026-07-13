import { z } from "zod";
import type { CheckBlockResult } from "@/endpoints/checkBlock.js";
import { checkBlock } from "@/endpoints/checkBlock.js";
import type { Tool } from "@/tools/types.js";

function formatReportedAddress(
  entry: CheckBlockResult["reportedAddress"][number],
): string {
  return `- ${entry.ipAddress} — score: ${entry.abuseConfidenceScore}/100, reports: ${entry.numReports}, country: ${entry.countryCode ?? "?"}, last reported: ${entry.mostRecentReport}`;
}

export const checkBlockTool: Tool = {
  name: "check_block",
  description:
    "Check a CIDR network block (e.g. a /24 subnet) for reported IPs — returns network range info plus a per-IP breakdown of any reported addresses within it. Use check_ip instead for a single IP address.",
  inputSchema: {
    network: z
      .string()
      .describe(
        "CIDR network to check, e.g. 192.168.1.0/24. Maximum range is /16 — wider blocks are rejected by the API.",
      ),
    max_age_in_days: z
      .number()
      .optional()
      .describe("Only include reports from the last N days (default: 30)"),
  },
  async handler(config, args) {
    const data = await checkBlock(
      config,
      args?.network as string,
      (args?.max_age_in_days as number) ?? 30,
    );

    const lines = [
      `Network: ${data.networkAddress}/${data.netmask}`,
      `Range: ${data.minAddress} - ${data.maxAddress}`,
      `Possible hosts: ${data.numPossibleHosts}`,
      `Address space: ${data.addressSpaceDesc}`,
      `Reported addresses: ${data.reportedAddress.length}`,
    ];

    if (data.reportedAddress.length > 0) {
      lines.push("", ...data.reportedAddress.map(formatReportedAddress));
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  },
};
