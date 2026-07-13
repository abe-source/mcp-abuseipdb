import { get, HttpError } from "@/client.js";
import type { Config } from "@/config.js";

export async function request<T>(
  config: Config,
  path: string,
  params: URLSearchParams,
): Promise<T> {
  const { data } = await get<{ data: T }>(
    {
      baseUrl: config.baseUrl,
      headers: { Key: config.apiKey, Accept: "application/json" },
      timeoutMs: config.timeoutMs,
    },
    path,
    params,
  ).catch(rethrowWithAbuseIpdbDetail);

  return data;
}

function rethrowWithAbuseIpdbDetail(error: unknown): never {
  if (error instanceof HttpError) {
    const detail = (error.body as { errors?: { detail: string }[] } | null)
      ?.errors?.[0]?.detail;
    throw new Error(detail ?? error.message);
  }
  throw error;
}
