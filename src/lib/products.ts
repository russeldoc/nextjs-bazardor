export type Product = {
  id: string; slug: string; name: string; category: string; categoryName: string;
  unit: string; price: number; minPrice: number; maxPrice: number; avgPrice: number;
  change: number; emoji: string; description: string; markets: MarketPrice[]; raw?: unknown;
};
export type MarketPrice = { market: string; price: number; unit: string; updated?: string };
export type Category = { id: string; name: string; slug: string; emoji: string };

const API = (process.env.BAZARDOR_API_URL || "https://api.abcz.workers.dev/api/bazardor").replace(/\/$/, "");
const bnDigits = "০১২৩৪৫৬৭৮৯";
export function toBn(value: number | string) {
  return String(value).replace(/\d/g, d => bnDigits[Number(d)]).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export function numeric(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[০-৯]/g, d => String("০১২৩৪৫৬৭৮৯".indexOf(d))).replace(/[৳,\s]/g, "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}
function first(obj: Record<string, unknown>, keys: string[], fallback: unknown = ""): unknown {
  for (const key of keys) if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];
  return fallback;
}
function rows(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.filter(x => x && typeof x === "object") as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["data", "products", "categories", "results", "items"]) if (Array.isArray(o[k])) return rows(o[k]);
  }
  return [];
}
const emojis: Record<string, string> = {
  chal:"🍚", rice:"🍚", dal:"🫘", lentil:"🫘", tel:"🫙", oil:"🫙", sobji:"🥬", vegetable:"🥬",
  mach:"🐟", fish:"🐟", mangsho:"🍗", meat:"🍗", dim:"🥚", egg:"🥚", alu:"🥔", potato:"🥔",
  peyaj:"🧅", onion:"🧅", morich:"🌶️", spice:"🌶️", roshun:"🧄", garlic:"🧄", ada:"🫚", ginger:"🫚"
};
export function productEmoji(name: string, category = "") {
  const s = `${name} ${category}`.toLowerCase();
  for (const [k, v] of Object.entries(emojis)) if (s.includes(k)) return v;
  if (/চাল|rice/.test(s)) return "🍚";
  if (/ডাল|lentil/.test(s)) return "🫘";
  if (/মাছ|fish|ইলিশ/.test(s)) return "🐟";
  if (/ডিম|egg/.test(s)) return "🥚";
  if (/আলু|potato/.test(s)) return "🥔";
  if (/পেঁয়াজ|পিয়াজ|onion/.test(s)) return "🧅";
  return "🛒";
}
function marketRows(value: unknown, unit: string): MarketPrice[] {
  if (!Array.isArray(value)) return [];
  return value.map((x, i) => {
    const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
    return { market: String(first(o, ["market", "bazar", "bazaar", "name", "location"], `বাজার ${i+1}`)),
      price: numeric(first(o, ["price", "currentPrice", "todayPrice", "amount"], 0)),
      unit: String(first(o, ["unit", "measurement"], unit)), updated: String(first(o, ["updatedAt", "date"], "")) };
  }).filter(x => x.price > 0);
}
export function normalizeProduct(o: Record<string, unknown>, index = 0): Product {
  const name = String(first(o, ["name", "title", "productName", "bn_name"], "নামহীন পণ্য"));
  const category = String(first(o, ["category", "categoryId", "categoryName", "type"], "other"));
  const unit = String(first(o, ["unit", "unitName", "measurement", "per"], "প্রতি কেজি"));
  const price = numeric(first(o, ["price", "currentPrice", "todayPrice", "current_price", "amount"], 0));
  const change = numeric(first(o, ["change", "changePercent", "change_percentage", "percentageChange", "priceChange"], 0));
  const id = String(first(o, ["id", "_id", "productId", "slug"], index + 1));
  const slug = String(first(o, ["slug", "id", "_id", "productId"], id)).toLowerCase().replace(/\s+/g, "-");
  const markets = marketRows(first(o, ["markets", "marketPrices", "bazars", "prices", "market_prices"], []), unit);
  const allPrices = markets.map(m => m.price).filter(p => p > 0);
  const minPrice = numeric(first(o, ["minPrice", "minimumPrice", "min_price"], allPrices.length ? Math.min(...allPrices) : price), price);
  const maxPrice = numeric(first(o, ["maxPrice", "maximumPrice", "max_price"], allPrices.length ? Math.max(...allPrices) : price), price);
  const avgPrice = numeric(first(o, ["avgPrice", "averagePrice", "avg_price"], allPrices.length ? allPrices.reduce((a,b)=>a+b,0)/allPrices.length : price), price);
  return { id, slug, name, category, categoryName: String(first(o, ["categoryName", "categoryBnName"], category)),
    unit, price, minPrice, maxPrice, avgPrice, change, emoji: String(first(o, ["emoji", "icon"], productEmoji(name, category))),
    description: String(first(o, ["description", "summary", "details"], `${name} এর আজকের বাজারদর ও বাজারভিত্তিক মূল্য দেখুন।`)), markets, raw: o };
}
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return rows(await res.json()).map(normalizeProduct);
  } catch (e) { console.error("Could not load BazarDor products", e); return []; }
}
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return rows(await res.json()).map((o, i) => {
      const name = String(first(o, ["name", "title", "categoryName", "bn_name"], "অন্যান্য"));
      const id = String(first(o, ["id", "slug", "_id", "categoryId"], name.toLowerCase()));
      return { id, slug: String(first(o, ["slug", "id", "_id"], id)).toLowerCase(), name, emoji: String(first(o, ["emoji", "icon"], productEmoji(name))) };
    });
  } catch (e) { console.error("Could not load BazarDor categories", e); return []; }
}
export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find(p => p.slug === slug || p.id === slug) || null;
}
export function priceLabel(n: number) { return `${toBn(Math.round(n))} টাকা`; }