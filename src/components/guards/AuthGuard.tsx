"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/betterAuth/auth-server";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

export async function AuthGuard({
  children,
  fallbackUrl = "/auth/signin",
}: AuthGuardProps) {
  const session = await getSession();

  // console.log(session);
  if (!session) {
    redirect(fallbackUrl);
  }

  return <>{children}</>;
}
