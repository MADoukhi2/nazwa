export type WorldId = "general" | "perfume" | "food";

export interface WorldConfig {
  id: WorldId;
  labelEn: string;
  labelAr: string;
  emoji: string;
  // dummyjson category slugs that belong to this world
  categories: string[];
  // unlock requirements (general is always open)
  streakDays?: number;
  coinCost?: number;
  blurb: { en: string; ar: string };
}

export const WORLDS: WorldConfig[] = [
  {
    id: "general",
    labelEn: "General Store",
    labelAr: "المتجر العام",
    emoji: "🛍️",
    categories: [], // empty = everything not in another world
    blurb: {
      en: "Everyday picks, electronics, fashion, and more.",
      ar: "منتجات يومية، إلكترونيات، أزياء، والمزيد.",
    },
  },
  {
    id: "perfume",
    labelEn: "Perfume World",
    labelAr: "عالم العطور",
    emoji: "🌸",
    categories: ["fragrances"],
    streakDays: 1,
    coinCost: 200,
    blurb: {
      en: "A curated boutique of fragrances and signature scents.",
      ar: "بوتيك مختار من العطور والروائح المميزة.",
    },
  },
  {
    id: "food",
    labelEn: "Gourmet Food",
    labelAr: "المأكولات الفاخرة",
    emoji: "🍱",
    categories: ["groceries"],
    streakDays: 2,
    coinCost: 400,
    blurb: {
      en: "Pantry essentials and gourmet groceries delivered.",
      ar: "أساسيات المطبخ ومأكولات فاخرة توصل لباب بيتك.",
    },
  },
];

export function worldForCategory(slug: string): WorldId {
  for (const w of WORLDS) {
    if (w.categories.includes(slug)) return w.id;
  }
  return "general";
}

export function getWorld(id: WorldId): WorldConfig {
  return WORLDS.find((w) => w.id === id)!;
}
