"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface Slide {
  image: string;
  title: string;
  description: string;
  badge: string;
  price?: string;
  slug?: string;
  href?: string;
}

export const defaultSlides: Slide[] = [
  {
    image: "/images/custom/img1.jpeg",
    title: "Vici Obsidian Signet Ring",
    description: "Solid 925 Sterling Silver with faceted black onyx & pavé brilliant diamond.",
    badge: "Bestseller",
    price: "₹14,200",
    slug: "vici-obsidian-signet-ring",
  },
  {
    image: "/images/custom/img2.jpeg",
    title: "Mariposa Butterfly Station Bracelet",
    description: "Articulated 925 Sterling Silver with delicate sculpted butterfly charms.",
    badge: "Bestseller",
    price: "₹6,800",
    slug: "mariposa-butterfly-station-bracelet",
  },
  {
    image: "/images/custom/img3.jpeg",
    title: "Ruby Solitaire Crown Ring",
    description: "Ergonomic sterling cuff & brilliant ruby crown setting in 925 silver.",
    badge: "New Arrival",
    price: "₹8,800",
    slug: "ruby-solitaire-crown-ring",
  },
  {
    image: "/images/custom/img4.jpeg",
    title: "Papillon Heart Ribbon Studs",
    description: "Architectural geometric earrings with pavé diamond ribbon wings.",
    badge: "Bestseller",
    price: "₹4,200",
    slug: "papillon-heart-ribbon-studs",
  },
  {
    image: "/images/custom/img5.jpeg",
    title: "Serpentine Infinity Studs",
    description: "Sculpted silver curves with scintillating micro-pavé lab diamonds.",
    badge: "New Arrival",
    price: "₹3,900",
    slug: "serpentine-infinity-studs",
  },
  {
    image: "/images/custom/img6.jpeg",
    title: "Florelle Clover Diamond Studs",
    description: "Four-petal floral clover studs bearing precision pavé settings.",
    badge: "Signature",
    price: "₹5,400",
    slug: "florelle-clover-diamond-studs",
  },
  {
    image: "/images/custom/img7.jpeg",
    title: "Marquise & Cushion Drop Set",
    description: "Chunky tactile silver link necklace with custom hand-carved clasp & earrings.",
    badge: "Haute Joaillerie",
    price: "₹18,500",
    slug: "marquise-cushion-drop-set",
  },
  {
    image: "/images/custom/img8.jpeg",
    title: "Amour Heart Solitaire Bracelet",
    description: "Bezel diamond accents paired with a romantic pavé heart centerpiece.",
    badge: "New Arrival",
    price: "₹8,400",
    slug: "amour-heart-solitaire-bracelet",
  },
  {
    image: "/images/custom/img9.jpeg",
    title: "Dual Phoenix Carved Signet",
    description: "Substantial 925 signet bearing hand-carved phoenix motifs & faceted noir gem.",
    badge: "Masterpiece",
    price: "₹18,500",
    slug: "dual-phoenix-carved-signet",
  },
  {
    image: "/images/custom/img10.jpeg",
    title: "Nacré Disc & Clover Bracelet",
    description: "Continuous articulated links with iridescent mother-of-pearl disc & clover.",
    badge: "Signature",
    price: "₹7,900",
    slug: "nacre-disc-clover-bracelet",
  },
  {
    image: "/images/custom/img11.jpeg",
    title: "Royal Sapphire Solitaire",
    description: "Radiant cobalt sapphire centerpiece encased in sculptural sterling filigree.",
    badge: "Rare Edition",
    price: "₹9,200",
    slug: "royal-sapphire-solitaire",
  },
  {
    image: "/images/custom/img12.jpeg",
    title: "Aura Infinity Loop Band",
    description: "Fluid sculpted 925 silver loop band contouring the finger with ergonomic grace.",
    badge: "Masterpiece",
    price: "₹4,900",
    slug: "aura-infinity-loop-band",
  },
  {
    image: "/images/custom/img13.jpeg",
    title: "Scalloped Petal Diamond Bracelet",
    description: "Hand-textured sterling silver petals accented by delicate pavé lab diamonds.",
    badge: "Signature",
    price: "₹9,200",
    slug: "scalloped-petal-diamond-bracelet",
  },
  {
    image: "/images/custom/img14.jpeg",
    title: "Alhambra Quatrefoil Station Bracelet",
    description: "Milgrain-edged silver quatrefoils aligned on an architectural box chain.",
    badge: "Exclusive",
    price: "₹11,500",
    slug: "alhambra-quatrefoil-station-bracelet",
  },
  {
    image: "/images/custom/img15.jpeg",
    title: "Crossed Heart Ribbon Studs",
    description: "Solid 925 sterling silver ribbons forming an interlocking heart motif.",
    badge: "Haute Joaillerie",
    price: "₹3,600",
    slug: "crossed-heart-ribbon-studs",
  },
  {
    image: "/images/custom/img16.jpeg",
    title: "Foliage Pavé Leaf Studs",
    description: "Sculptural sterling leaf studs with intricate pavé diamond vein detailing.",
    badge: "Atelier Drop",
    price: "₹4,800",
    slug: "foliage-pave-leaf-studs",
  },
  {
    image: "/images/custom/img17.jpeg",
    title: "Lotus Bloom Diamond Studs",
    description: "Handcrafted 925 silver sacred lotus studs sparkling with central stones.",
    badge: "New Arrival",
    price: "₹5,100",
    slug: "lotus-bloom-diamond-studs",
  },
  {
    image: "/images/custom/img18.jpeg",
    title: "Grecian Meander Signet",
    description: "Archival Greek key border surrounding an obsidian tablet in solid silver.",
    badge: "Atelier Drop",
    price: "₹16,400",
    slug: "grecian-meander-signet",
  },
  {
    image: "/images/custom/img19.jpeg",
    title: "Baroque Scroll Signet Ring",
    description: "Hand-carved baroque filigree flourishes encasing a faceted center stone.",
    badge: "Prestige",
    price: "₹15,800",
    slug: "baroque-scroll-signet-ring",
  },
  {
    image: "/images/custom/img20.jpeg",
    title: "Crown Filigree Onyx Solitaire",
    description: "Dramatic focal medallion showcasing high-relief sculptural metalwork.",
    badge: "Exclusive",
    price: "₹17,200",
    slug: "crown-filigree-onyx-solitaire",
  },
  {
    image: "/images/custom/img21.jpeg",
    title: "Double Floret Layering Set",
    description: "Dual graduated blossom necklace with matching floral cluster earrings.",
    badge: "Bestseller",
    price: "₹14,800",
    slug: "double-floret-layering-set",
  },
  {
    image: "/images/custom/img22.jpeg",
    title: "Celestial Kurma Turtle Ring",
    description: "Raised central setting surrounded by a glittering orbital pavé shell.",
    badge: "Haute Joaillerie",
    price: "₹19,800",
    slug: "celestial-kurma-turtle-ring",
  },
  {
    image: "/images/custom/img23.jpeg",
    title: "Quatrefoil Quadrant Studs",
    description: "Geometric four-square diamond symmetry rendered in bright polished silver.",
    badge: "Signature",
    price: "₹4,600",
    slug: "quatrefoil-quadrant-studs",
  },
  {
    image: "/images/custom/img24.jpeg",
    title: "Sovereign Sacred Turtle Ring",
    description: "Sacred geometry and talismanic pavé shell hand-finished in 925 silver.",
    badge: "Atelier Drop",
    price: "₹18,900",
    slug: "sovereign-sacred-turtle-ring",
  },
  {
    image: "/images/custom/img25.jpeg",
    title: "Imperial Tiara Crown Studs",
    description: "Regal crown prongs elevating brilliant pavilion-cut gems in sterling silver.",
    badge: "Exclusive",
    price: "₹6,200",
    slug: "imperial-tiara-crown-studs",
  },
  {
    image: "/images/custom/img26.jpeg",
    title: "Pink Blossom Petite Ring",
    description: "Slender articulated silver band featuring a pink sapphire floral cluster.",
    badge: "New Arrival",
    price: "₹6,800",
    slug: "pink-blossom-petite-ring",
  },
  {
    image: "/images/custom/img27.jpeg",
    title: "Cascade Droplet Multi-Station Set",
    description: "Two-tier cable chain with pavé droplets & matching teardrop studs.",
    badge: "Exclusive",
    price: "₹16,200",
    slug: "cascade-droplet-multi-station-set",
  },
  {
    image: "/images/custom/img28.jpeg",
    title: "Amour Pavé Heart Ring",
    description: "Romantic micro-pavé silver heart ring with an invisible mirror finish.",
    badge: "Classic",
    price: "₹5,400",
    slug: "amour-pave-heart-ring",
  },
  {
    image: "/images/custom/img29.jpeg",
    title: "Industrial Screwed Signet",
    description: "Architectonic 925 silver signet with precision-engineered bolt accents.",
    badge: "Signature",
    price: "₹22,000",
    slug: "industrial-screwed-signet",
  },
];

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 380) {
    return {
      distanceDivisor: 100,
      velocityDivisor: 400,
      sensitivity: 150,
      xMultiplier: 65,
      yMultiplier: 12,
      rotationMultiplier: 6,
      scaleReduction: 0.08,
    };
  }
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 78,
      yMultiplier: 16,
      rotationMultiplier: 7,
      scaleReduction: 0.07,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

export interface CarouselStackedProps {
  slides?: Slide[];
  className?: string;
  autoPlay?: boolean;
}

export const CarouselStacked = ({
  slides = defaultSlides,
  className = "",
  autoPlay = true,
}: CarouselStackedProps) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const isHovered = React.useRef(false);
  const lastHoverIndex = React.useRef<number | null>(null);

  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update current active index for indicator
  React.useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (latest) => {
      const normalized = Math.round(latest) % total;
      setCurrentIndex((normalized + total) % total);
    });
    return () => unsubscribe();
  }, [scrollProgress, total]);

  // Gentle ambient drift when idle (pauses on hover or drag)
  React.useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (!isHovered.current && !isDragging.current) {
        const current = Math.round(scrollProgress.get());
        animate(scrollProgress, current + 1, {
          type: "spring",
          stiffness: 35,
          damping: 22,
          mass: 1.5,
        });
      }
    }, 5500);
    return () => clearInterval(interval);
  }, [autoPlay, scrollProgress]);

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth],
  );

  const handleDragStart = () => {
    isDragging.current = true;
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setTimeout(() => {
      isDragging.current = false;
    }, 60);

    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-2, Math.min(2, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 55,
      damping: 20,
      mass: 1.2,
    });
  };

  const handleCardFocus = (index: number) => {
    if (isDragging.current) return;
    lastHoverIndex.current = index;
    const current = scrollProgress.get();
    let diff = (index - (current % total)) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    animate(scrollProgress, current + diff, {
      type: "spring",
      stiffness: 50,
      damping: 20,
      mass: 1.2,
    });
  };

  const handlePrev = () => {
    const current = Math.round(scrollProgress.get());
    animate(scrollProgress, current - 1, {
      type: "spring",
      stiffness: 50,
      damping: 20,
      mass: 1.2,
    });
  };

  const handleNext = () => {
    const current = Math.round(scrollProgress.get());
    animate(scrollProgress, current + 1, {
      type: "spring",
      stiffness: 50,
      damping: 20,
      mass: 1.2,
    });
  };

  // Interactive mouse movement scrubbing across container with gentle smoothing
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    isHovered.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width; // 0.0 to 1.0

    // Only steer towards a slide if moving cursor across zones
    const targetIndex = Math.min(
      total - 1,
      Math.max(0, Math.floor(relativeX * total)),
    );

    if (targetIndex !== lastHoverIndex.current) {
      lastHoverIndex.current = targetIndex;
      const current = scrollProgress.get();
      let diff = (targetIndex - (current % total)) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      animate(scrollProgress, current + diff, {
        type: "spring",
        stiffness: 42,
        damping: 22,
        mass: 1.4,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full py-10 sm:py-16 bg-transparent overflow-hidden select-none",
        className,
      )}
    >
      {/* Header section above carousel */}
      <div className="carousel-header flex flex-col items-center text-center max-w-xl px-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#0B4A3B]/80 text-[#1fe0bb] text-[0.58rem] sm:text-[0.65rem] tracking-[0.2em] sm:tracking-[0.25em] uppercase font-bold mb-2.5 sm:mb-3 border border-[#1fe0bb]/30 backdrop-blur-md shadow-[0_0_15px_rgba(31,224,187,0.15)]">
          <Sparkles className="w-3 h-3 text-[#1fe0bb]" />
          <span>Atelier Showcase</span>
        </div>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white bg-gradient-to-b from-white via-[#E6F2EA] to-[#94A3B8] bg-clip-text text-transparent drop-shadow-md">
          Curated Silver Creations
        </h2>
        <p className="text-[0.72rem] sm:text-sm text-[#A7F3D0]/80 mt-1.5 sm:mt-2 font-serif italic max-w-xs sm:max-w-none">
          Swipe or browse smoothly across the atelier showcase.
        </p>
      </div>

      {/* Main Stack Container with Drag & Hover Motion */}
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDrag={(_, info) => {
          isDragging.current = true;
          const delta = -info.delta.x / config.sensitivity;
          scrollProgress.set(scrollProgress.get() + delta);
        }}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
          lastHoverIndex.current = null;
        }}
        onMouseMove={handleContainerMouseMove}
        className="relative w-full max-w-7xl h-72 xs:h-80 sm:h-[420px] lg:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {slides.map((slide, i) => (
          <Card
            key={i}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            isDraggingRef={isDragging}
            onSelect={() => handleCardFocus(i)}
            onHover={() => handleCardFocus(i)}
          />
        ))}
      </motion.div>

      {/* Navigation Controls & Indicators (Responsive: Counter on Mobile, Dots on Desktop) */}
      <div className="relative z-30 flex items-center gap-3 sm:gap-6 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={handlePrev}
          onMouseEnter={handlePrev}
          aria-label="Previous slide"
          className="p-2 sm:p-3 rounded-full bg-[#0B4A3B]/80 border border-[#1fe0bb]/30 text-[#E6F2EA] hover:bg-[#1F7A5C] hover:text-white transition-all duration-300 shadow-lg shadow-[#021811]/60 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Mobile Luxury Atelier Counter */}
        <div className="sm:hidden flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B4A3B]/80 border border-[#1fe0bb]/25 backdrop-blur-sm shadow-md">
          <span className="font-mono text-xs font-bold text-[#1fe0bb] tracking-wider">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-[0.65rem] text-white/40">/</span>
          <span className="font-mono text-[0.65rem] text-white/60 tracking-wider">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Desktop Dot Indicators */}
        <div className="hidden sm:flex items-center gap-1.5 lg:gap-2 max-w-[60vw] overflow-x-auto py-1 scrollbar-none">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleCardFocus(i)}
              onMouseEnter={() => handleCardFocus(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 transition-all duration-300 rounded-full cursor-pointer shrink-0",
                currentIndex === i
                  ? "w-8 bg-[#1fe0bb] shadow-[0_0_10px_#1fe0bb]"
                  : "w-2 bg-white/25 hover:bg-white/50 hover:w-4",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          onMouseEnter={handleNext}
          aria-label="Next slide"
          className="p-2 sm:p-3 rounded-full bg-[#0B4A3B]/80 border border-[#1fe0bb]/30 text-[#E6F2EA] hover:bg-[#1F7A5C] hover:text-white transition-all duration-300 shadow-lg shadow-[#021811]/60 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

interface CardProps {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  isDraggingRef?: React.MutableRefObject<boolean>;
  onSelect?: () => void;
  onHover?: () => void;
}

const Card = ({
  slide,
  index,
  total,
  progress,
  config,
  isDraggingRef,
  onSelect,
  onHover,
}: CardProps) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDraggingRef?.current) {
      return;
    }
    onSelect?.();
    const targetUrl = slide.href || (slide.slug ? `/product/${slide.slug}` : undefined);
    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(100 - Math.abs(o) * 10),
  );

  return (
    <motion.div
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      className={cn(
        "absolute rounded-2xl pointer-events-auto",
        "w-36 h-52 xs:w-44 xs:h-60 sm:w-56 sm:h-80 lg:w-64 lg:h-96",
      )}
    >
      {/* Inner card container: hover enlargement, focus trigger and product navigation */}
      <div
        onClick={handleCardClick}
        onMouseEnter={onHover}
        title={`View ${slide.title}`}
        className={cn(
          "relative w-full h-full rounded-2xl overflow-hidden bg-muted group cursor-pointer",
          "transition-all duration-700 ease-out",
          "hover:scale-108 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(11,74,59,0.35)]",
          "border border-white/20 hover:border-[#1F7A5C]/70 hover:ring-2 hover:ring-[#1F7A5C]/60",
        )}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-115 pointer-events-none"
        />

        <motion.div
          style={{
            opacity: useTransform(
              offset,
              [-2, -0.5, 0, 0.5, 2],
              [0.5, 0.2, 0, 0.2, 0.5],
            ),
          }}
          className="absolute inset-0 bg-black pointer-events-none group-hover:opacity-10 transition-opacity duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        <Badge className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 lg:top-6 lg:right-6 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md text-[0.55rem] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-[#0B4A3B] shadow-md border border-white/40 pointer-events-none">
          {slide.badge}
        </Badge>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-8 sm:left-5 sm:right-5 lg:bottom-10 lg:left-6 lg:right-6 text-white text-left pointer-events-none">
          {slide.price && (
            <span className="inline-block text-[0.58rem] sm:text-[0.68rem] tracking-[0.14em] sm:tracking-[0.2em] font-semibold text-[#1F7A5C] bg-white/95 px-1.5 py-0.5 rounded mb-1 shadow-sm">
              {slide.price}
            </span>
          )}
          <motion.p
            style={{
              opacity: useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]),
            }}
            className="text-xs sm:text-lg lg:text-xl font-bold leading-tight mb-0.5 sm:mb-1 drop-shadow-md text-white font-display truncate"
          >
            {slide.title}
          </motion.p>
          <motion.p
            style={{
              opacity: useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]),
            }}
            className="hidden sm:block text-xs text-white/80 line-clamp-2 italic font-serif leading-relaxed"
          >
            {slide.description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default CarouselStacked;
