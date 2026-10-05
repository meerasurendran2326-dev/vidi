import { PrismaClient } from "@prisma/client";
import { jewelleryProducts } from "../app/data/jewellery-products";

const prisma = new PrismaClient();
const defaultStock = Number(process.env.SEED_DEFAULT_STOCK ?? "0");

if (!Number.isSafeInteger(defaultStock) || defaultStock < 0) {
  throw new Error("SEED_DEFAULT_STOCK must be a non-negative integer.");
}

async function main() {
  for (const product of jewelleryProducts) {
    const price = product.price.replace(/[^\d.]/g, "");
    const images = product.images?.length ? product.images : [product.image];

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description || product.subtitle,
        category: product.category,
        price,
        stock: defaultStock,
        images,
        active: true,
      },
      update: {
        name: product.name,
        description: product.description || product.subtitle,
        category: product.category,
        images,
      },
    });
  }

  console.info(`Seeded ${jewelleryProducts.length} catalog products.`);
}

main()
  .catch((error: unknown) => {
    console.error("Catalog seed failed.", error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
