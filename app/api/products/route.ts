import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

const querySchema = z.object({
  category: z.string().trim().min(1).max(80).optional(),
  search: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().trim().min(1).max(64).optional(),
});

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    category: url.searchParams.get("category") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json({ error: "Invalid product query." }, { status: 400 });
  }

  const { category, search, limit, cursor } = parsed.data;
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(category ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = products.length > limit;
    const page = products.slice(0, limit);
    return Response.json({
      products: page.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toFixed(2),
        stock: product.stock,
        images: product.images,
        active: product.active,
        variants: product.variants,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      })),
      hasMore,
      nextCursor: hasMore ? page.at(-1)?.id ?? null : null,
      limit,
    });
  } catch {
    return Response.json(
      { error: "Product catalog is temporarily unavailable." },
      { status: 503 },
    );
  }
}
