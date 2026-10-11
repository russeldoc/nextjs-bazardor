import { cache } from "react";
import { toBn, pct } from "./format";
export { toBn, pct };

export type MarketPrice = { market: string; division: string; min: number; max: number; price: number; unit: string };
export type Product = {
  id: string; slug: string; name: string; category: string; categoryName: string; categoryEmoji: string;
  unit: string; price: number; yesterday: number; lastWeek: number; lastMonth: number;
  minPrice: number; maxPrice: number; avgPrice: number; change: number;
  emoji: string; description: string; markets: MarketPrice[]; raw?: unknown;
};
export type Category = { id: string; name: string; slug: string; emoji: string };

const API = (process.env.BAZARDOR_API_URL || "https://openapi.programming-hero.com/api/bazardor").replace(/\/$/, "");
const BN = "০১২৩৪৫৬৭৮৯";

type Obj = Record<string, unknown>;

export function numeric(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const s = value.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));
    const n = Number(s.replace(/[৳,\s]/g, "").replace(/[^\d.-]/g, ""));
    if (!Number.isFinite(n)) return fallback;
    return /▼|↓/.test(s) && n > 0 ? -n : n;
  }
  return fallback;
}
function first(obj: Obj, keys: string[], fallback: unknown = ""): unknown {
  for (const key of keys) if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];
  return fallback;
}
function rows(data: unknown): Obj[] {
  if (Array.isArray(data)) return data.filter((x) => x && typeof x === "object") as Obj[];
  if (data && typeof data === "object") {
    const o = data as Obj;
    for (const k of ["data", "products", "categories", "results", "items"]) if (Array.isArray(o[k])) return rows(o[k]);
  }
  return [];
}

const emojiByWord: Record<string, string> = {
  chal: "🍚", rice: "🍚", dal: "🫘", tel: "🫙", oil: "🫙", sobji: "🥬", mach: "🐟", fish: "🐟",
  mangsho: "🍗", meat: "🍗", dim: "🥚", egg: "🥚", alu: "🥔", peyaj: "🧅", morich: "🌶️", roshun: "🧄", ada: "🫚",
};
export function productEmoji(name: string, category = "") {
  const s = `${name} ${category}`.toLowerCase();
  if (/চাল/.test(s)) return "🍚";
  if (/ডাল/.test(s)) return "🫘";
  if (/মাছ|ইলিশ/.test(s)) return "🐟";
  if (/ডিম/.test(s)) return "🥚";
  if (/আলু/.test(s)) return "🥔";
  if (/পেঁয়াজ|পিয়াজ/.test(s)) return "🧅";
  for (const [k, v] of Object.entries(emojiByWord)) if (new RegExp(`\\b${k}\\b`).test(s)) return v;
  return "🛒";
}
function pickEmoji(o: Obj, keys: string[], fallback: string) {
  const v = String(first(o, keys, ""));
  return v && v.length <= 8 && !/^https?:|\.(png|jpe?g|svg|webp)$/i.test(v) ? v : fallback;
}

const unitMap: Record<string, string> = {
  kg: "প্রতি কেজি", কেজি: "প্রতি কেজি", l: "প্রতি লিটার", litre: "প্রতি লিটার", liter: "প্রতি লিটার", ltr: "প্রতি লিটার",
  dozen: "প্রতি ডজন", dz: "প্রতি ডজন", piece: "প্রতি পিস", pcs: "প্রতি পিস", pc: "প্রতি পিস", hali: "প্রতি হালি", gram: "প্রতি গ্রাম",
};
function unitLabel(u: string) {
  const k = u.trim().toLowerCase();
  if (unitMap[k]) return unitMap[k];
  return /^প্রতি/.test(u.trim()) ? u.trim() : `প্রতি ${u.trim()}`;
}

function marketRows(value: unknown, unit: string, fallbackPrice: number): MarketPrice[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((x, i) => {
      const o = (x && typeof x === "object" ? x : {}) as Obj;
      let min = numeric(first(o, ["min", "minPrice", "low"], 0));
      let max = numeric(first(o, ["max", "maxPrice", "high"], 0));
      const single = numeric(first(o, ["price", "today", "currentPrice", "amount"], 0));
      if (!min && !max && single) { min = single; max = single; }
      if (!min) min = max;
      if (!max) max = min;
      const price = single || (min && max ? (min + max) / 2 : fallbackPrice);
      return {
        market: String(first(o, ["market", "bazar", "bazaar", "name", "location"], `বাজার ${i + 1}`)),
        division: String(first(o, ["division", "district", "region"], "")),
        min, max, price, unit,
      };
    })
    .filter((m) => m.max > 0);
}

export function normalizeProduct(o: Obj, index = 0): Product {
  const name = String(first(o, ["nameBn", "name", "title", "productName", "bn_name", "nameEn"], "নামহীন পণ্য"));
  const rawCat = first(o, ["category", "categoryId", "type"], "other");
  const category = (rawCat && typeof rawCat === "object"
    ? String(first(rawCat as Obj, ["id", "slug", "name"], "other"))
    : String(rawCat)
  ).toLowerCase();
  const categoryName = String(first(o, ["categoryNameBn", "categoryName", "categoryBnName"], category));
  const unit = unitLabel(String(first(o, ["unit", "unitName", "measurement", "per"], "kg")));
  const price = numeric(first(o, ["today", "price", "currentPrice", "todayPrice", "current_price", "amount"], 0));
  const yesterday = numeric(o.yesterday, 0);

  // change can be { dir: "up"|"down", pct: 2.1 } or a plain number
  let change = 0;
  const ch = o.change;
  if (ch && typeof ch === "object") {
    const c = ch as Obj;
    change = numeric(first(c, ["pct", "percent", "percentage", "value"], 0));
    const dir = String(c.dir ?? c.direction ?? "").toLowerCase();
    if (/down|fall|decrease/.test(dir)) change = -Math.abs(change);
    else if (/up|rise|increase/.test(dir)) change = Math.abs(change);
  } else if (ch !== undefined && ch !== null) {
    change = numeric(ch, 0);
  } else if (yesterday > 0 && price > 0) {
    change = ((price - yesterday) / yesterday) * 100;
  }

  const id = String(first(o, ["id", "_id", "productId", "slug"], index + 1));
  const slug = String(first(o, ["slug", "id", "_id", "productId"], id)).toLowerCase().replace(/\s+/g, "-");
  const markets = marketRows(first(o, ["markets", "marketPrices", "bazars", "market_prices"], []), unit, price);
  const mins = markets.map((m) => m.min).filter((n) => n > 0);
  const maxs = markets.map((m) => m.max).filter((n) => n > 0);
  const mids = markets.map((m) => m.price).filter((n) => n > 0);
  const minPrice = mins.length ? Math.min(...mins) : price;
  const maxPrice = maxs.length ? Math.max(...maxs) : price;
  const avgPrice = mids.length ? mids.reduce((a, b) => a + b, 0) / mids.length : price;
  const categoryEmoji = pickEmoji(o, ["categoryIcon", "categoryEmoji"], productEmoji(categoryName, category));

  return {
    id, slug, name, category, categoryName, categoryEmoji, unit, price,
    yesterday, lastWeek: numeric(o.lastWeek, 0), lastMonth: numeric(o.lastMonth, 0),
    minPrice, maxPrice, avgPrice, change,
    emoji: pickEmoji(o, ["image", "emoji", "icon", "categoryIcon"], productEmoji(name, category)),
    description: String(first(o, ["description", "summary", "details"], `${name} এর আজকের বাজারদর ও বিভিন্ন বাজারের মূল্য দেখুন।`)),
    markets, raw: o,
  };
}

export const getProducts = cache(fetchProducts);
async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const json = await res.json();
    const list = rows(json);
    if (!list.length) console.warn("BazarDor: no product rows found. Raw response:", JSON.stringify(json).slice(0, 500));
    return list.map((o, i) => normalizeProduct(o, i));
  } catch (e) { console.error("Could not load BazarDor products", e); return []; }
}

export const getCategories = cache(fetchCategories);
async function fetchCategories(): Promise<Category[]> {
  const products = await getProducts();
  // Products carry the Bengali category name + icon, so use them as the source of truth
  const derived = new Map<string, { name: string; emoji: string }>();
  for (const p of products) if (!derived.has(p.category)) derived.set(p.category, { name: p.categoryName, emoji: p.categoryEmoji });

  let list: Category[] = [];
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    list = rows(await res.json()).map((o) => {
      const id = String(first(o, ["id", "slug", "_id", "categoryId"], "")).toLowerCase();
      const name = String(first(o, ["nameBn", "name", "title", "categoryName", "bn_name"], id || "অন্যান্য"));
      return { id, slug: String(first(o, ["slug", "id", "_id"], id)).toLowerCase(), name, emoji: pickEmoji(o, ["icon", "emoji", "image", "categoryIcon"], productEmoji(name, id)) };
    });
  } catch (e) { console.error("Could not load BazarDor categories", e); }

  const merged = list.map((c) => { const d = derived.get(c.slug); return d ? { ...c, name: d.name, emoji: d.emoji } : c; });
  for (const [slug, d] of derived) if (!merged.some((c) => c.slug === slug)) merged.push({ id: slug, slug, name: d.name, emoji: d.emoji });
  return merged;
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug || p.id === slug) || null;
}
export function priceLabel(n: number) { return `${toBn(Math.round(n))} টাকা`; }
