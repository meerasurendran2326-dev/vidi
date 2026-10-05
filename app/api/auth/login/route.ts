import { prisma } from "@/app/lib/prisma";
import { loginSchema } from "@/app/lib/auth-validation";
import { createSession, setSessionCookie, verifyPassword } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Validation failed.",
        details: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return Response.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const sessionToken = await createSession(user.id);
    await setSessionCookie(sessionToken);

    return Response.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      message: "Signed in successfully.",
    });
  } catch (error) {
    console.error("Login failed:", error);
    return Response.json(
      { error: "Unable to sign in. Please try again later." },
      { status: 500 },
    );
  }
}
