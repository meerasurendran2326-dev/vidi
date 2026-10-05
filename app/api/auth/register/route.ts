import { prisma } from "@/app/lib/prisma";
import { signUpSchema } from "@/app/lib/auth-validation";
import { createSession, hashPassword, setSessionCookie } from "@/app/lib/auth";

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

  const parsed = signUpSchema.safeParse(body);
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

  const { fullName, email, phone, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return Response.json(
        { error: "An account with this email address already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    const sessionToken = await createSession(user.id);
    await setSessionCookie(sessionToken);

    return Response.json(
      {
        user,
        message: "Account created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Sign up failed:", error);
    return Response.json(
      { error: "Unable to create account. Please try again later." },
      { status: 500 },
    );
  }
}
