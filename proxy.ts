import type { NextProxy } from "next/server";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { NextResponse } from "next/server";

const requestsPerIp = new RateLimiterMemory({
  points: 240,
  duration: 60,
  keyPrefix: "proxy-global-ip",
});

export const proxy: NextProxy = async (request) => {
  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedIps = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((value) => value.trim());
  const clientIp =
    (realIp && isIP(realIp) ? realIp : forwardedIps?.find((ip) => isIP(ip))) ??
    "unknown";
  const key = createHash("sha256").update(clientIp).digest("hex");

  try {
    await requestsPerIp.consume(key);
    return NextResponse.next();
  } catch (error) {
    if (!(error instanceof RateLimiterRes)) {
      console.error("Échec du rate limiter Proxy", error);
      return NextResponse.json(
        { error: "Service temporairement indisponible." },
        {
          status: 503,
          headers: { "Retry-After": "5", "Cache-Control": "no-store" },
        },
      );
    }

    const retryAfter = Math.max(1, Math.ceil(error.msBeforeNext / 1000));
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez réessayer plus tard." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "Cache-Control": "no-store",
          "X-RateLimit-Limit": "240",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
