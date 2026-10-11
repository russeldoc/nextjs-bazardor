# 🛒 বাজার দর (BazarDor)

**প্রয়োজনীয় পণ্যের দাম এক নজরে।**

বাজার দর হলো বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর দেখার একটি responsive web application। এখানে চাল, ডাল, তেল, সবজি, মাছ, মাংস ও অন্যান্য পণ্যের আজকের দাম, গতকালের তুলনায় দাম বাড়া-কমার হার এবং বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম দেখা যায়। সব দাম বাংলা অঙ্কে দেখানো হয়।

- **Live site:** `https://nextjs-bazardor.vercel.app` _(deploy করার পর লিংক বসান)_
- **GitHub:** `https://github.com/russeldoc/nextjs-bazardor`

---

## ✨ Key Features

1. **দৈনিক বাজারদর:** BazarDor API থেকে সব পণ্য ও ক্যাটাগরি লোড হয়; প্রতিটি কার্ডে ইমোজি, নাম, একক, আজকের দাম ও পরিবর্তনের badge (সবুজ ▲, লাল ▼, ধূসর —) থাকে।
2. **দাম ওঠানামার সেকশন:** হোম পেজে "আজ দাম বেড়েছে ▲" (শীর্ষ ৬টি) এবং "আজ দাম কমেছে ▼" (শীর্ষ ৬টি) আলাদা সেকশন।
3. **চলমান price ticker:** navbar-এর নিচে অসীম marquee strip: ইমোজি + নাম + টাকা/একক + ▲/▼ শতাংশ। মাউস রাখলে থামে, `prefers-reduced-motion` মানে।
4. **ক্যাটাগরি পেজ ও সাজানো:** প্রতিটি ক্যাটাগরির আলাদা পেজ। "সাজান" dropdown দিয়ে ডিফল্ট / দাম কম থেকে বেশি / দাম বেশি থেকে কম। সংখ্যার মান ধরে sort হয়, বাংলা অঙ্কের টেক্সট ধরে নয়।
5. **পণ্যের বিস্তারিত পেজ:** সর্বনিম্ন, সর্বোচ্চ ও গড় দাম, গতকাল/গত সপ্তাহ/গত মাসের দাম এবং বাজারভিত্তিক (বিভাগসহ) দামের টেবিল।
6. **Authentication (Better Auth):** Email/Password, Google ও GitHub login; MongoDB-তে account সংরক্ষণ। Email verification ও forgot password ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে।
7. **Protected routes:** পণ্যের বিস্তারিত পেজ, প্রোফাইল ও প্রোফাইল আপডেট শুধু login করা ব্যবহারকারী দেখতে পারেন। না থাকলে `/signin`-এ নিয়ে যায় এবং toast দেখায়। সুরক্ষা দুই স্তরে: `proxy.ts` (দ্রুত cookie check) ও server-side session validation।
8. **প্রোফাইল ও তথ্য আপডেট:** My Profile পেজে নাম ও ইমেইল; "তথ্য আপডেট করুন" বাটন একটি আলাদা route-এ নিয়ে যায়, যেখানে নাম বদলানো যায়।
9. **Loading, empty ও 404 state:** skeleton loader, ক্যাটাগরি খালি/ভুল হলে 404-style বার্তা, এবং যেকোনো অজানা route-এ বন্ধুত্বপূর্ণ 404 পেজ ("হোম পেজে ফিরে যান" বাটনসহ)।
10. **Toast notification:** login, signup, logout, validation error ও protected-route redirect-এ প্রাসঙ্গিক বার্তা (`react-hot-toast`)।
11. **সম্পূর্ণ responsive ডিজাইন:** mobile, tablet ও desktop-এ grid নিজে নিজে ১ → ২ → ৩ → ৪ কলামে বদলায়; navbar-এর ক্যাটাগরি লিংক অনুভূমিকভাবে scroll করে; hero মোবাইলে উপর-নিচ হয়ে যায়।
12. **বাংলা UI ও SEO basics:** সব লেবেল বাংলায়, বাংলা অঙ্কে দাম (যেমন ১,৮৫০ টাকা), `lang="bn"`, প্রতিটি পেজের title ও description।

---

## 🧰 Technologies Used

| Technology | Purpose |
| --- | --- |
| **Next.js (App Router)** | UI, routing, server components, API routes |
| **React + TypeScript** | Component-based UI with type safety |
| **Tailwind CSS v4** | Styling and responsive layout |
| **Better Auth** | Email/password, Google ও GitHub authentication |
| **MongoDB (Atlas)** | User ও session সংরক্ষণ (Better Auth MongoDB adapter) |
| **react-hot-toast** | Toast notification |
| **lucide-react** | Icons |
| **BazarDor API** | পণ্য, ক্যাটাগরি ও বাজারদরের তথ্য |
| **Vercel** | Deployment |

---

## 🧭 Pages & Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Hero, দাম বেড়েছে / কমেছে, সব পণ্য (`#সব-পণ্য`) |
| `/category/[slug]` | Public | ক্যাটাগরির পণ্য + sort dropdown |
| `/product/[slug]` | 🔒 Login required | পণ্যের বিস্তারিত ও বাজারভিত্তিক দাম |
| `/signin` | Public | লগইন (email/password, Google, GitHub) |
| `/signup` | Public | রেজিস্ট্রেশন (নাম, ইমেইল, পাসওয়ার্ড) |
| `/profile` | 🔒 Login required | প্রোফাইল দেখা |
| `/profile/update` | 🔒 Login required | নাম আপডেট করা |
| `/api/auth/[...all]` | — | Better Auth handler |
| `/api/products` | — | নরমালাইজ করা পণ্যের JSON |
| অন্য যেকোনো route | — | 404 পেজ |

---

## 🚀 Getting Started (Local)

**Requirements:** Node.js 20.9 বা নতুন, npm, এবং একটি MongoDB Atlas (বা local MongoDB) connection string।

```bash
# 1. dependencies install
npm install

# 2. environment file তৈরি (Windows cmd: copy .env.example .env.local)
cp .env.example .env.local

# 3. .env.local ফাইলে মান বসান (নিচের টেবিল দেখুন), তারপর
npm run dev
```

Browser-এ খুলুন: [http://localhost:3000](http://localhost:3000)

`.env.local` পরিবর্তন করলে dev server restart করতে হবে।

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `MONGODB_DATABASE` | – | Database নাম (default: `bazardor`) |
| `BETTER_AUTH_SECRET` | ✅ | কমপক্ষে ৩২ অক্ষরের random secret |
| `BETTER_AUTH_URL` | ✅ | App-এর URL (local: `http://localhost:3000`, production: আপনার https domain) |
| `NEXT_PUBLIC_APP_URL` | ✅ | `BETTER_AUTH_URL`-এর মতোই |
| `BAZARDOR_API_URL` | – | Default: `https://openapi.programming-hero.com/api/bazardor` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login-এর জন্য | Google Cloud Console থেকে |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub login-এর জন্য | GitHub Developer Settings থেকে |

> 🔒 `.env` ও `.env.local` কখনো GitHub-এ push করবেন না।

### Google ও GitHub login সেটআপ

OAuth callback URL হিসেবে দিন:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
https://YOUR-DOMAIN/api/auth/callback/google
https://YOUR-DOMAIN/api/auth/callback/github
```

GitHub প্রতিটি OAuth App-এ একটি মাত্র callback URL নেয়, তাই local ও production-এর জন্য আলাদা দুটি App বানান। Credentials না থাকলে email/password login ঠিকই চলে; শুধু social বাটনগুলো error toast দেখায়।

---

## 🌐 API

Base URL: `https://openapi.programming-hero.com/api/bazardor`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/categories` | সব ক্যাটাগরি |
| GET | `/categories/:id` | একটি ক্যাটাগরি |
| GET | `/products` | সব পণ্য |
| GET | `/products?category=chal` | ক্যাটাগরি অনুযায়ী ফিল্টার |
| GET | `/products/:id` | একটি পণ্য |

`src/lib/products.ts` API-র ডেটা (`nameBn`, `today`, `change.pct`, `markets[].min/max` ইত্যাদি) অ্যাপের নিজস্ব `Product` টাইপে রূপান্তর করে। API-র field নাম বদলালে শুধু `normalizeProduct()` ফাংশন ঠিক করলেই হবে।

---

## 🗂️ Project Structure

```text
bazardor/
├── public/
│   └── bazar-hero.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts
│   │   │   └── products/route.ts
│   │   ├── category/[slug]/{page,loading}.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── profile/{page.tsx,update/page.tsx}
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   ├── ChangeBadge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SkeletonGrid.tsx
│   │   ├── SortProducts.tsx
│   │   ├── Ticker.tsx
│   │   └── ToastProvider.tsx
│   ├── lib/
│   │   ├── auth.ts          # Better Auth + MongoDB
│   │   ├── auth-client.ts   # Better Auth React client
│   │   ├── format.ts        # বাংলা অঙ্ক, শতাংশ, দিক
│   │   ├── products.ts      # API fetch + data mapping
│   │   └── session.ts       # server-side route guard
│   └── proxy.ts             # protected-route redirect
├── .env.example
├── next.config.ts
├── postcss.config.mjs
├── package.json
└── tsconfig.json
```

---

## 📦 Deploy to Vercel

1. প্রজেক্ট GitHub-এ push করুন (`.env*` ফাইল ছাড়া)।
2. [vercel.com](https://vercel.com)-এ repository import করুন।
3. **Settings → Environment Variables**-এ `.env.local`-এর সব মান যোগ করুন। `BETTER_AUTH_URL` ও `NEXT_PUBLIC_APP_URL`-এ আপনার চূড়ান্ত `https://...vercel.app` URL দিন।
4. MongoDB Atlas-এ **Network Access → Allow access from anywhere (`0.0.0.0/0`)** দিন, কারণ Vercel-এর IP স্থির নয়।
5. Google/GitHub OAuth App-এ production callback URL যোগ করুন।
6. Deploy করুন। `[slug]` dynamic route-গুলো server-rendered, তাই যেকোনো পেজ reload করলে 404 আসে না।
7. জমা দেওয়ার আগে লোকালি `npm run build` চালিয়ে দেখুন কোনো error আছে কি না।

---

## 🛠️ Troubleshooting

- **`querySrv ETIMEOUT` (MongoDB):** আপনার নেটওয়ার্ক SRV DNS lookup আটকে দিচ্ছে। `src/lib/auth.ts`-এ Google DNS সেট করুন (`dns.setServers(["8.8.8.8","1.1.1.1"])`) অথবা Atlas-এর non-SRV `mongodb://` connection string ব্যবহার করুন।
- **স্টাইল লোড হচ্ছে না / `Unknown at rule: @theme`:** `postcss.config.mjs` ফাইলে `@tailwindcss/postcss` plugin আছে কি না দেখুন এবং `npm install -D tailwindcss @tailwindcss/postcss postcss` চালান।
- **পণ্য দেখা যাচ্ছে না:** `.env`-এ পুরোনো `BAZARDOR_API_URL` আছে কি না দেখুন, তারপর dev server restart করুন।
- **`.next` ক্যাশ ঝামেলা করলে:** server বন্ধ করে `.next` ফোল্ডার মুছে আবার `npm run dev` চালান।

---

## ⚠️ Notes

- সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
- দাম ও ক্যাটাগরির তথ্য সম্পূর্ণ BazarDor API-র ওপর নির্ভরশীল।
- Email verification ও forgot password এই সংস্করণে ইচ্ছাকৃতভাবে যুক্ত করা হয়নি।

---

© বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
