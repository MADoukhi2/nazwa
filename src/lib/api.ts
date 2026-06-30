import { SEED_PRODUCTS } from "./seed";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images: string[];
  source: "dummyjson" | "fakestore" | "seed";
}

export interface Category {
  slug: string;
  name: string;
}

const DUMMY = "https://dummyjson.com";
const FAKE = "https://fakestoreapi.com";

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function normalizeDummy(p: any): Product {
  return {
    id: `dj-${p.id}`,
    title: p.title,
    description: p.description ?? "",
    price: Number(p.price ?? 0),
    rating: Number(p.rating ?? 0),
    category: p.category ?? "general",
    thumbnail: p.thumbnail ?? p.images?.[0] ?? "",
    images: (p.images && p.images.length ? p.images : [p.thumbnail]).filter(Boolean),
    source: "dummyjson",
  };
}

function normalizeFake(p: any): Product {
  return {
    id: `fs-${p.id}`,
    title: p.title,
    description: p.description ?? "",
    price: Number(p.price ?? 0),
    rating: Number(p.rating?.rate ?? 0),
    category: (p.category ?? "general").replace(/\s+/g, "-").toLowerCase(),
    thumbnail: p.image,
    images: [p.image],
    source: "fakestore",
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const tasks: Promise<Product[]>[] = [
    fetchJson<{ products: any[] }>(`${DUMMY}/products?limit=100`)
      .then((d) => d.products.map(normalizeDummy))
      .catch(() => []),
    fetchJson<any[]>(`${FAKE}/products`)
      .then((d) => d.map(normalizeFake))
      .catch(() => []),
  ];
  const [a, b] = await Promise.all(tasks);
  const merged = [...a, ...b];
  if (merged.length === 0) return SEED_PRODUCTS;
  return merged;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await fetchJson<any[]>(`${DUMMY}/products/categories`);
    return data.map((c) =>
      typeof c === "string"
        ? { slug: c, name: c }
        : { slug: c.slug ?? c.name, name: c.name ?? c.slug }
    );
  } catch {
    return [
      { slug: "general", name: "General" },
      { slug: "fragrances", name: "Fragrances" },
      { slug: "groceries", name: "Groceries" },
    ];
  }
}

export function categoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
