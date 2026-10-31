"server-only";

import { isIP } from "node:net";
import { headers } from "next/headers";

export async function getIp() {
  const headersList = await headers();

  // Trust these headers only when the hosting proxy overwrites/normalizes them.
  const realIp = headersList.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp)) return realIp;

  const forwardedFor = headersList.get("x-forwarded-for");
  const clientIp = forwardedFor
    ?.split(",")
    .map((value) => value.trim())
    .find((value) => isIP(value));

  return clientIp ?? "unknown";
}
