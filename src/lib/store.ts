import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "./api";
import type { WorldId } from "./categories";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  thumbnail: string;
  qty: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  placedAt: number;
}

export interface Profile {
  username: string;
  joinedAt: number;
  referralCode: string;
  referralRedeemed: boolean;
}

interface State {
  hydrated: boolean;
  prefs: { theme: "light" | "dark"; lang: "en" | "ar" };
  profile: Profile;
  wallet: { coins: number };
  streak: {
    current: number;
    longest: number;
    lastCheckIn: string | null; // YYYY-MM-DD
  };
  unlocks: Record<WorldId, boolean>;
  cart: CartItem[];
  orders: Order[];

  setHydrated: () => void;
  setTheme: (t: "light" | "dark") => void;
  setLang: (l: "en" | "ar") => void;
  setUsername: (n: string) => void;

  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  checkIn: () => { awarded: number; day: number } | null;
  canCheckInToday: () => boolean;

  unlockWorld: (w: WorldId) => void;

  addToCart: (p: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  placeOrder: () => Order;

  redeemReferral: (code: string) => boolean;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isYesterday(prev: string): boolean {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const key = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  return prev === key;
}

function generateReferral(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SIM-${s}`;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      prefs: { theme: "light", lang: "en" },
      profile: {
        username: "Guest",
        joinedAt: Date.now(),
        referralCode: generateReferral(),
        referralRedeemed: false,
      },
      wallet: { coins: 100 }, // signup bonus
      streak: { current: 0, longest: 0, lastCheckIn: null },
      unlocks: { general: true, perfume: false, food: false },
      cart: [],
      orders: [],

      setHydrated: () => set({ hydrated: true }),
      setTheme: (theme) => set((s) => ({ prefs: { ...s.prefs, theme } })),
      setLang: (lang) => set((s) => ({ prefs: { ...s.prefs, lang } })),
      setUsername: (username) => set((s) => ({ profile: { ...s.profile, username } })),

      addCoins: (n) => set((s) => ({ wallet: { coins: s.wallet.coins + n } })),
      spendCoins: (n) => {
        const { wallet } = get();
        if (wallet.coins < n) return false;
        set({ wallet: { coins: wallet.coins - n } });
        return true;
      },

      canCheckInToday: () => get().streak.lastCheckIn !== todayKey(),

      checkIn: () => {
        const { streak } = get();
        const today = todayKey();
        if (streak.lastCheckIn === today) return null;
        const newCurrent =
          streak.lastCheckIn && isYesterday(streak.lastCheckIn) ? streak.current + 1 : 1;
        const bonus = Math.min(newCurrent * 10, 100);
        const awarded = 20 + bonus;
        set((s) => ({
          streak: {
            current: newCurrent,
            longest: Math.max(s.streak.longest, newCurrent),
            lastCheckIn: today,
          },
          wallet: { coins: s.wallet.coins + awarded },
        }));
        return { awarded, day: newCurrent };
      },

      unlockWorld: (w) =>
        set((s) => ({ unlocks: { ...s.unlocks, [w]: true } })),

      addToCart: (p, qty = 1) => {
        const cart = [...get().cart];
        const existing = cart.find((c) => c.productId === p.id);
        if (existing) existing.qty += qty;
        else
          cart.push({
            productId: p.id,
            title: p.title,
            price: p.price,
            thumbnail: p.thumbnail,
            qty,
          });
        set({ cart });
      },
      updateQty: (id, qty) =>
        set((s) => ({
          cart: s.cart
            .map((c) => (c.productId === id ? { ...c, qty } : c))
            .filter((c) => c.qty > 0),
        })),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== id) })),
      clearCart: () => set({ cart: [] }),

      placeOrder: () => {
        const { cart, wallet } = get();
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const order: Order = {
          id: `${Date.now().toString(36).toUpperCase()}`,
          items: cart,
          total,
          placedAt: Date.now(),
        };
        set((s) => ({
          orders: [order, ...s.orders],
          cart: [],
          wallet: { coins: wallet.coins + 50 },
        }));
        return order;
      },

      redeemReferral: (code) => {
        const { profile } = get();
        if (profile.referralRedeemed) return false;
        if (!code || code.trim().toUpperCase() === profile.referralCode) return false;
        set((s) => ({
          profile: { ...s.profile, referralRedeemed: true },
          wallet: { coins: s.wallet.coins + 150 },
        }));
        return true;
      },
    }),
    {
      name: "simumart:v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as any)
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export const SHIPPING_FLAT = 15;
export const FREE_SHIPPING_THRESHOLD = 200;
export const VAT_RATE = 0.15;

export function calcTotals(items: CartItem[]) {
  const subtotal = cartSubtotal(items);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + shipping + vat;
  return { subtotal, shipping, vat, total };
}
