import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser, isAdminEmail } from "@/app/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

const patchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  // If changing slug, check uniqueness against other products
  if (parsed.data.slug) {
    const conflict = await prisma.product.findFirst({
      where: { slug: parsed.data.slug, NOT: { id } },
    });
    if (conflict) {
      return Response.json({ error: "Slug is already in use by another product." }, { status: 409 });
    }
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    return Response.json({ product });
  } catch {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Product not found or cannot be deleted." }, { status: 404 });
  }
}
