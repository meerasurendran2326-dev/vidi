import { getCurrentUser } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return Response.json({ user });
  } catch (error) {
    console.error("Get user failed:", error);
    return Response.json({ user: null });
  }
}
