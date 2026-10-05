import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const parsedSlug = z.string().trim().min(1).max(160).safeParse(slug);
  if (!parsedSlug.success) {
    return Response.json({ error: "Invalid product slug." }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { slug: parsedSlug.data },
    });
    if (!product || !product.active) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    return Response.json({
      product: {
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
      },
    });
  } catch {
    return Response.json(
      { error: "Product lookup is temporarily unavailable." },
      { status: 503 },
    );
  }
}
