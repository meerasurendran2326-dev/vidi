import { revokeCurrentSession } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await revokeCurrentSession();
    return Response.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ success: true });
  }
}
