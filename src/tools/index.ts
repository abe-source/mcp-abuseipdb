import { checkBlockTool } from "@/tools/checkBlock.js";
import { checkIpTool } from "@/tools/checkIp.js";
import { getBlacklistTool } from "@/tools/getBlacklist.js";
import { reportsTool } from "@/tools/reports.js";
import type { Tool } from "@/tools/types.js";

export const tools: Tool[] = [
  checkIpTool,
  getBlacklistTool,
  checkBlockTool,
  reportsTool,
];
