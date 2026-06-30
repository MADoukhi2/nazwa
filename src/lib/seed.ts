import type { Product } from "./api";

// Fallback catalog if all APIs fail.
export const SEED_PRODUCTS: Product[] = [
  {
    id: "seed-1",
    title: "Wireless Studio Headphones",
    description: "Over-ear noise-cancelling headphones with 40h battery.",
    price: 189,
    rating: 4.6,
    category: "audio",
    thumbnail: "https://images.unsplash.com/photo-1518444028785-8f6f3a8f6f1c?w=600",
    images: ["https://images.unsplash.com/photo-1518444028785-8f6f3a8f6f1c?w=900"],
    source: "seed",
  },
  {
    id: "seed-2",
    title: "Minimalist Leather Wallet",
    description: "Slim bifold wallet with RFID protection.",
    price: 49,
    rating: 4.3,
    category: "accessories",
    thumbnail: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=900"],
    source: "seed",
  },
  {
    id: "seed-3",
    title: "Ceramic Pour-Over Kit",
    description: "Hand-glazed dripper plus 100 filters.",
    price: 38,
    rating: 4.8,
    category: "kitchen",
    thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900"],
    source: "seed",
  },
  {
    id: "seed-4",
    title: "Linen Throw Blanket",
    description: "Stonewashed pure linen, 130x180cm.",
    price: 72,
    rating: 4.5,
    category: "home",
    thumbnail: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600",
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900"],
    source: "seed",
  },
];

export const SEED_REVIEWS = [
  { name: "Sara A.", rating: 5, text: "Exactly as pictured. Shipping was quick." },
  { name: "Omar K.", rating: 4, text: "Great quality for the price." },
  { name: "Lina R.", rating: 5, text: "Obsessed. Already ordering another." },
  { name: "Yousef M.", rating: 4, text: "Solid build. Packaging was lovely." },
  { name: "Maya H.", rating: 5, text: "Better than expected — recommend." },
];
