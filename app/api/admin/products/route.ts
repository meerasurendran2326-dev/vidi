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

const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional().default(""),
  category: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  active: z.boolean().optional().default(true),
  images: z.array(z.string()).optional().default([]),
});

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return Response.json({ error: "A product with this slug already exists." }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: parsed.data.images ?? [],
    },
  });

  return Response.json({ product }, { status: 201 });
}
