export type ProductCategory = "rings" | "bracelet" | "pendent-set" | "stud";

export interface JewelleryProduct {
  id: string;
  slug: string;
  category: ProductCategory;
  name: string;
  subtitle: string;
  description?: string;
  price: string;
  image: string;
  images?: string[];
  badge?: string;
  isNew?: boolean;
  stock?: number;
  availability?: string;
}

export const jewelleryCategoryInfo: Record<
  ProductCategory,
  { title: string; tagline: string; description: string }
> = {
  rings: {
    title: "Rings",
    tagline: "Worn close, treasured forever.",
    description:
      "Each ring in our atelier is hand-crafted from certified 925 sterling silver, shaped to carry meaning on every finger.",
  },
  bracelet: {
    title: "Bracelet",
    tagline: "Elegance clasped at your wrist.",
    description:
      "From sculptural cuffs to delicate chain links, our bracelets are crafted in certified 925 silver to adorn every occasion.",
  },
  "pendent-set": {
    title: "Pendent Set",
    tagline: "A story draped around your neck.",
    description:
      "Our pendant sets are composed as wearable poetry — each piece paired with a hand-finished silver chain, designed to rest perfectly against the skin.",
  },
  stud: {
    title: "Stud",
    tagline: "Small in size, infinite in grace.",
    description:
      "Our studs are precision-crafted in 925 sterling silver — minimal, refined pieces that whisper luxury with every glance.",
  },
};

export const jewelleryProducts: JewelleryProduct[] = [
  {
    id: "ring-1",
    slug: "vici-obsidian-signet-ring",
    category: "rings",
    name: "Vici Obsidian Signet Ring",
    subtitle: "925 Sterling Silver · Faceted Black Onyx",
    price: "₹14,200",
    image: "/images/custom/img1.jpeg",
    badge: "Bestseller",
  },
  {
    id: "ring-2",
    slug: "ruby-solitaire-crown-ring",
    category: "rings",
    name: "Ruby Solitaire Crown Ring",
    subtitle: "Sterling Silver · Brilliant Ruby",
    price: "₹8,800",
    image: "/images/custom/img3.jpeg",
    isNew: true,
  },
  {
    id: "ring-3",
    slug: "dual-phoenix-carved-signet",
    category: "rings",
    name: "Dual Phoenix Carved Signet",
    subtitle: "925 Silver · Faceted Noir Gem",
    price: "₹18,500",
    image: "/images/custom/img9.jpeg",
    badge: "Masterpiece",
  },
  {
    id: "ring-4",
    slug: "royal-sapphire-solitaire",
    category: "rings",
    name: "Royal Sapphire Solitaire",
    subtitle: "Sterling Silver · Cobalt Sapphire",
    price: "₹9,200",
    image: "/images/custom/img11.jpeg",
  },
  {
    id: "ring-5",
    slug: "aura-infinity-loop-band",
    category: "rings",
    name: "Aura Infinity Loop Band",
    subtitle: "Fluid Sculpted 925 Silver",
    price: "₹4,900",
    image: "/images/custom/img12.jpeg",
    isNew: true,
  },
  {
    id: "ring-6",
    slug: "grecian-meander-signet",
    category: "rings",
    name: "Grecian Meander Signet",
    subtitle: "Archival Greek Key · Onyx Tablet",
    price: "₹16,400",
    image: "/images/custom/img18.jpeg",
    badge: "Atelier Drop",
  },
  {
    id: "ring-7",
    slug: "baroque-scroll-signet-ring",
    category: "rings",
    name: "Baroque Scroll Signet Ring",
    subtitle: "Hand-Carved Silver · Faceted Stone",
    price: "₹15,800",
    image: "/images/custom/img19.jpeg",
  },
  {
    id: "ring-8",
    slug: "crown-filigree-onyx-solitaire",
    category: "rings",
    name: "Crown Filigree Onyx Solitaire",
    subtitle: "Pierced Filigree · Oval Faceted Gem",
    price: "₹17,200",
    image: "/images/custom/img20.jpeg",
    badge: "Exclusive",
  },
  {
    id: "ring-9",
    slug: "celestial-kurma-turtle-ring",
    category: "rings",
    name: "Celestial Kurma Turtle Ring",
    subtitle: "925 Silver · Pavé Diamond Shell",
    price: "₹19,800",
    image: "/images/custom/img22.jpeg",
    badge: "Haute Joaillerie",
  },
  {
    id: "ring-10",
    slug: "sovereign-sacred-turtle-ring",
    category: "rings",
    name: "Sovereign Sacred Turtle Ring",
    subtitle: "Geometric Swastik Pavé Shell",
    price: "₹18,900",
    image: "/images/custom/img24.jpeg",
  },
  {
    id: "ring-11",
    slug: "pink-blossom-petite-ring",
    category: "rings",
    name: "Pink Blossom Petite Ring",
    subtitle: "Silver · Pink Sapphire Floral",
    price: "₹6,800",
    image: "/images/custom/img26.jpeg",
    isNew: true,
  },
  {
    id: "ring-12",
    slug: "amour-pave-heart-ring",
    category: "rings",
    name: "Amour Pavé Heart Ring",
    subtitle: "Sterling Silver · Micro Pavé",
    price: "₹5,400",
    image: "/images/custom/img28.jpeg",
  },
  {
    id: "ring-13",
    slug: "industrial-screwed-signet",
    category: "rings",
    name: "Industrial Screwed Signet",
    subtitle: "Solid 925 Silver · Architectonic Link",
    price: "₹22,000",
    image: "/images/custom/img29.jpeg",
    badge: "Signature",
  },
  {
    id: "br-1",
    slug: "mariposa-butterfly-station-bracelet",
    category: "bracelet",
    name: "Mariposa Butterfly Station Bracelet",
    subtitle: "Articulated 925 Silver · Butterfly Charms",
    price: "₹6,800",
    image: "/images/custom/img2.jpeg",
    badge: "Bestseller",
  },
  {
    id: "br-2",
    slug: "amour-heart-solitaire-bracelet",
    category: "bracelet",
    name: "Amour Heart Solitaire Bracelet",
    subtitle: "Bezel Diamonds · Pavé Heart Centerpiece",
    price: "₹8,400",
    image: "/images/custom/img8.jpeg",
    isNew: true,
  },
  {
    id: "br-3",
    slug: "nacre-disc-clover-bracelet",
    category: "bracelet",
    name: "Nacré Disc & Clover Bracelet",
    subtitle: "Mother-of-Pearl · Diamond Pavé Clover",
    price: "₹7,900",
    image: "/images/custom/img10.jpeg",
    badge: "Signature",
  },
  {
    id: "br-4",
    slug: "scalloped-petal-diamond-bracelet",
    category: "bracelet",
    name: "Scalloped Petal Diamond Bracelet",
    subtitle: "Hand-Textured Silver · Pavé Accents",
    price: "₹9,200",
    image: "/images/custom/img13.jpeg",
  },
  {
    id: "br-5",
    slug: "alhambra-quatrefoil-station-bracelet",
    category: "bracelet",
    name: "Alhambra Quatrefoil Station Bracelet",
    subtitle: "Milgrain-Edged Clovers · Box Chain",
    price: "₹11,500",
    image: "/images/custom/img14.jpeg",
    badge: "Exclusive",
  },
  {
    id: "ps-1",
    slug: "marquise-cushion-drop-set",
    category: "pendent-set",
    name: "Marquise & Cushion Drop Set",
    subtitle: "925 Silver · Choker Necklace & Matching Drop Earrings",
    price: "₹18,500",
    image: "/images/custom/img7.jpeg",
    badge: "Haute Joaillerie",
    isNew: true,
  },
  {
    id: "ps-2",
    slug: "double-floret-layering-set",
    category: "pendent-set",
    name: "Double Floret Layering Set",
    subtitle: "Dual Graduated Blossom Necklace & Cluster Studs",
    price: "₹14,800",
    image: "/images/custom/img21.jpeg",
    badge: "Bestseller",
  },
  {
    id: "ps-3",
    slug: "cascade-droplet-multi-station-set",
    category: "pendent-set",
    name: "Cascade Droplet Multi-Station Set",
    subtitle: "Two-Tier Cable Chain with Teardrop Pavé & Studs",
    price: "₹16,200",
    image: "/images/custom/img27.jpeg",
    badge: "Exclusive",
  },
  {
    id: "st-1",
    slug: "papillon-heart-ribbon-studs",
    category: "stud",
    name: "Papillon Heart Ribbon Studs",
    subtitle: "925 Silver · Pavé Diamond Wings",
    price: "₹4,200",
    image: "/images/custom/img4.jpeg",
    badge: "Bestseller",
  },
  {
    id: "st-2",
    slug: "serpentine-infinity-studs",
    category: "stud",
    name: "Serpentine Infinity Studs",
    subtitle: "Sculpted Silver · Pavé Curve",
    price: "₹3,900",
    image: "/images/custom/img5.jpeg",
    isNew: true,
  },
  {
    id: "st-3",
    slug: "florelle-clover-diamond-studs",
    category: "stud",
    name: "Florelle Clover Diamond Studs",
    subtitle: "Four-Petal Clover · Pavé Setting",
    price: "₹5,400",
    image: "/images/custom/img6.jpeg",
    badge: "Signature",
  },
  {
    id: "st-4",
    slug: "crossed-heart-ribbon-studs",
    category: "stud",
    name: "Crossed Heart Ribbon Studs",
    subtitle: "Solid 925 Sterling Silver",
    price: "₹3,600",
    image: "/images/custom/img15.jpeg",
  },
  {
    id: "st-5",
    slug: "foliage-pave-leaf-studs",
    category: "stud",
    name: "Foliage Pavé Leaf Studs",
    subtitle: "Sculptural Leaf · Diamond Veins",
    price: "₹4,800",
    image: "/images/custom/img16.jpeg",
    badge: "Atelier Drop",
  },
  {
    id: "st-6",
    slug: "lotus-bloom-diamond-studs",
    category: "stud",
    name: "Lotus Bloom Diamond Studs",
    subtitle: "Handcrafted 925 Silver · Sacred Lotus",
    price: "₹5,100",
    image: "/images/custom/img17.jpeg",
    isNew: true,
  },
  {
    id: "st-7",
    slug: "quatrefoil-quadrant-studs",
    category: "stud",
    name: "Quatrefoil Quadrant Studs",
    subtitle: "Four-Square Diamond Geometric",
    price: "₹4,600",
    image: "/images/custom/img23.jpeg",
  },
  {
    id: "st-8",
    slug: "imperial-tiara-crown-studs",
    category: "stud",
    name: "Imperial Tiara Crown Studs",
    subtitle: "Regal Royal Crown · Pavé Gems",
    price: "₹6,200",
    image: "/images/custom/img25.jpeg",
    badge: "Exclusive",
  },
];

export function getProductBySlug(slug: string): JewelleryProduct | undefined {
  return jewelleryProducts.find((product) => product.slug === slug);
}

export function getProductsByCategory(
  category: ProductCategory,
): JewelleryProduct[] {
  return jewelleryProducts.filter((product) => product.category === category);
}
