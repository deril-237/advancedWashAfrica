import { getSession } from "@/lib/betterAuth/auth-server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: LayoutProps<"/auth">) {
  const session = await getSession();

  if (session) {
    redirect("/admin");
  }

  return <>{children}</>;
}
