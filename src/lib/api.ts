export const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export type MarketPrice = {
  market: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  unit: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  change: number;
  emoji: string;
  description: string;
  markets: MarketPrice[];
};

const emojiFor = (name: string) => {
  const n = name.toLowerCase();
  if (/chal|rice|চাল/.test(n)) return "🍚";
  if (/dal|lentil|ডাল/.test(n)) return "🫘";
  if (/oil|তেল/.test(n)) return "🫙";
  if (/potato|alu|আলু/.test(n)) return "🥔";
  if (/onion|peyaj|পেঁয়াজ|পেঁয়াজ/.test(n)) return "🧅";
  if (/chili|morich|মরিচ/.test(n)) return "🌶️";
  if (/fish|মাছ/.test(n)) return "🐟";
  if (/chicken|মুরগি/.test(n)) return "🍗";
  if (/egg|ডিম/.test(n)) return "🥚";
  if (/ginger|আদা/.test(n)) return "🫚";
  if (/garlic|রসুন/.test(n)) return "🧄";
  if (/tomato|টমেটো/.test(n)) return "🍅";
  if (/brinjal|eggplant|বেগুন/.test(n)) return "🍆";
  if (/cucumber|শসা/.test(n)) return "🥒";
  if (/banana|কলা/.test(n)) return "🍌";
  return "🛍️";
};

function unwrap(payload: any): any[] {
  const body = payload?.data ?? payload?.result ?? payload;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.products)) return body.products;
  if (Array.isArray(body?.categories)) return body.categories;
  if (Array.isArray(body?.items)) return body.items;
  return body && typeof body === "object" ? [body] : [];
}
const num = (...values: any[]) => {
  for (const value of values) {
    const n = typeof value === "string" ? Number(value.replace(/[৳,৳\s]/g, "")) : Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
};
const text = (...values: any[]) => {
  const value = values.find(v => typeof v === "string" && v.trim());
  return value ? value.trim() : "";
};
const slugify = (value: string) => value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");

function normalizeProduct(raw: any, index: number): Product {
  const name = text(raw?.name, raw?.title, raw?.product_name, raw?.productName, `পণ্য ${index + 1}`);
  const cat = raw?.category;
  const categoryName = typeof cat === "object" ? text(cat?.name, cat?.title) : text(cat, raw?.category_name, raw?.categoryName, "অন্যান্য");
  const category = typeof cat === "object" ? text(cat?.slug, cat?.id, cat?.name) : text(raw?.category_slug, raw?.category_id, cat, slugify(categoryName));
  const price = num(raw?.price, raw?.current_price, raw?.currentPrice, raw?.average_price, raw?.averagePrice, raw?.min_price);
  const minPrice = num(raw?.min_price, raw?.minPrice, raw?.price_min, price);
  const maxPrice = num(raw?.max_price, raw?.maxPrice, raw?.price_max, price);
  const marketsRaw = raw?.markets ?? raw?.market_prices ?? raw?.marketPrices ?? raw?.prices_by_market ?? [];
  const markets = Array.isArray(marketsRaw) ? marketsRaw.map((m: any) => ({
    market: text(m?.market, m?.market_name, m?.name, m?.bazaar, "স্থানীয় বাজার"),
    minPrice: num(m?.min_price, m?.minPrice, m?.price),
    maxPrice: num(m?.max_price, m?.maxPrice, m?.price),
    price: num(m?.price, m?.average_price)
  })) : [];
  return {
    id: String(raw?.id ?? raw?._id ?? raw?.product_id ?? index + 1),
    name, slug: slugify(text(raw?.slug, raw?.id, name)),
    category, categoryName, unit: text(raw?.unit, raw?.unit_name, raw?.measurement, "প্রতি কেজি"),
    price, minPrice, maxPrice, averagePrice: num(raw?.average_price, raw?.averagePrice, price),
    change: Number(raw?.change_percentage ?? raw?.price_change_percentage ?? raw?.change ?? raw?.changePercent ?? 0) || 0,
    emoji: text(raw?.emoji) || emojiFor(name),
    description: text(raw?.description, raw?.summary, raw?.market_summary, `${name} এর সাম্প্রতিক বাজারদর দেখুন।`),
    markets
  };
}

async function getJson(path: string) {
  const response = await fetch(`${API_BASE}${path}`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}
export async function getProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const json = await getJson(`/products${query}`);
  return unwrap(json).map(normalizeProduct);
}
export async function getProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const json = await getJson(`/products/${encodeURIComponent(idOrSlug)}`);
    const rows = unwrap(json);
    if (rows.length) return normalizeProduct(rows[0], 0);
  } catch {}
  const products = await getProducts();
  return products.find(p => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
}
export async function getCategories(): Promise<Category[]> {
  const json = await getJson("/categories");
  return unwrap(json).map((c: any, i: number) => {
    const name = text(c?.name, c?.title, c?.category_name, `ক্যাটাগরি ${i + 1}`);
    return { id: String(c?.id ?? c?._id ?? c?.slug ?? slugify(name)), name, slug: text(c?.slug, c?.id, slugify(name)), icon: text(c?.icon, c?.emoji) || "🧺" };
  });
}
export const formatBdt = (value: number) => `${Math.round(value).toLocaleString("bn-BD")} টাকা`;
export const formatPercent = (value: number) => `${Math.abs(value).toLocaleString("bn-BD", { maximumFractionDigits: 1 })}%`;
