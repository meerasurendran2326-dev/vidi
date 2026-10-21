import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://vinivicividi.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        "/account",
        "/account/",
        "/cart",
        "/cart/",
        "/checkout",
        "/checkout/",
        "/login",
        "/register",
        "/order-success/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
