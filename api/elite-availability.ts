import type { IncomingMessage, ServerResponse } from "node:http";

const DEFAULT_WHOP_API_BASE_URL = "https://api.whop.com/api/v1";
const SUCCESS_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

type Environment = Record<string, string | undefined>;

interface FetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

type FetchImplementation = (
  input: string,
  init: {
    headers: Record<string, string>;
    signal: AbortSignal;
  },
) => Promise<FetchResponse>;

interface HandlerOptions {
  env?: Environment;
  fetchImplementation?: FetchImplementation;
}

function sendJson(
  request: IncomingMessage,
  response: ServerResponse,
  statusCode: number,
  payload: Record<string, unknown>,
  cacheControl = "no-store",
) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", cacheControl);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(request.method === "HEAD" ? undefined : JSON.stringify(payload));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function handleEliteAvailability(
  request: IncomingMessage,
  response: ServerResponse,
  options: HandlerOptions = {},
) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendJson(request, response, 405, { error: "method_not_allowed" });
    return;
  }

  const env = options.env ?? process.env;
  const apiKey = env.WHOP_API_KEY?.trim();
  const planId = env.WHOP_ELITE_PLAN_ID?.trim();

  if (!apiKey || !planId) {
    sendJson(request, response, 503, { error: "availability_not_configured" });
    return;
  }

  if (!planId.startsWith("plan_")) {
    sendJson(request, response, 500, { error: "invalid_plan_configuration" });
    return;
  }

  const apiBaseUrl = (env.WHOP_API_BASE_URL?.trim() || DEFAULT_WHOP_API_BASE_URL).replace(/\/$/, "");
  const fetchImplementation = options.fetchImplementation ?? fetch;

  try {
    const whopResponse = await fetchImplementation(
      `${apiBaseUrl}/plans/${encodeURIComponent(planId)}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (!whopResponse.ok) {
      sendJson(request, response, 502, { error: "whop_request_failed" });
      return;
    }

    const plan = await whopResponse.json();
    if (!isRecord(plan) || typeof plan.unlimited_stock !== "boolean") {
      sendJson(request, response, 502, { error: "invalid_whop_response" });
      return;
    }

    if (plan.unlimited_stock) {
      sendJson(
        request,
        response,
        200,
        { available: null, unlimited: true, source: "whop" },
        SUCCESS_CACHE_CONTROL,
      );
      return;
    }

    const available = plan.stock;
    if (typeof available !== "number" || !Number.isInteger(available) || available < 0) {
      sendJson(request, response, 502, { error: "invalid_whop_stock" });
      return;
    }

    sendJson(
      request,
      response,
      200,
      { available, unlimited: false, source: "whop" },
      SUCCESS_CACHE_CONTROL,
    );
  } catch (error: unknown) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    sendJson(request, response, timedOut ? 504 : 502, {
      error: timedOut ? "whop_request_timed_out" : "whop_request_failed",
    });
  }
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  await handleEliteAvailability(request, response);
}
