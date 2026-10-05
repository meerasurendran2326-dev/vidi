import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  hashSessionToken,
} from "./auth-crypto";

export * from "./auth-crypto";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  createdAt: Date;
}

/**
 * Creates a new session in the database and returns raw token for cookie.
 */
export async function createSession(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("base64url");
  const hashedToken = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.session.create({
    data: {
      sessionToken: hashedToken,
      userId,
      expiresAt,
    },
  });

  return rawToken;
}

/**
 * Attaches the session cookie to the response.
 */
export async function setSessionCookie(rawToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Revokes current session from database and clears cookie.
 */
export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const hashed = hashSessionToken(token);
    await prisma.session
      .deleteMany({
        where: { sessionToken: hashed },
      })
      .catch(() => {});
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

/**
 * Validates the current session server-side.
 * Returns the AuthenticatedUser or null if absent/expired.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token || typeof token !== "string" || token.length < 10) {
      return null;
    }

    const hashed = hashSessionToken(token);
    const session = await prisma.session.findUnique({
      where: { sessionToken: hashed },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await prisma.session
        .delete({ where: { id: session.id } })
        .catch(() => {});
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

/**
 * Server Component / Route helper that requires authentication.
 * Redirects to /login if unauthenticated.
 */
export async function requireAuth(returnUrl?: string): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    const redirectUrl = returnUrl
      ? `/login?callbackUrl=${encodeURIComponent(returnUrl)}`
      : "/login";
    redirect(redirectUrl);
  }
  return user;
}

/**
 * Returns true if the given email matches the ADMIN_EMAIL environment variable.
 * The comparison is case-insensitive.
 */
export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}

/**
 * Server Component / Route helper that requires admin access.
 * Redirects to /login if unauthenticated, returns 403 redirect if not admin.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!isAdminEmail(user.email)) {
    redirect("/");
  }
  return user;
}
