import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

/** True when the current request belongs to a signed-in admin. */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}
