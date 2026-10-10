# 🛒 বাজার দর (BazarDor)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, দৈনিক মূল্য পরিবর্তন এবং বাজারভিত্তিক দাম এক নজরে দেখার জন্য একটি responsive web app।

## ✨ Features

1. **দৈনিক বাজারদর:** প্রদত্ত BazarDor API থেকে পণ্য ও ক্যাটাগরির তথ্য লোড।
2. **দাম ওঠানামা:** সর্বোচ্চ দাম বৃদ্ধি ও হ্রাস পাওয়া পণ্যের আলাদা সেকশন।
3. **Responsive product grid:** মোবাইল, ট্যাবলেট ও ডেস্কটপে ব্যবহারযোগ্য কার্ড।
4. **Live-style ticker:** পণ্যের দাম ও পরিবর্তনের শতাংশসহ চলমান price ticker।
5. **Product details:** সর্বনিম্ন, সর্বোচ্চ, গড় এবং বাজারভিত্তিক দামের টেবিল।
6. **Category filtering and sorting:** ক্যাটাগরি পেজ ও numeric price sorting; বাংলা অঙ্কও parse করা হয়।
7. **Authentication:** Better Auth email/password signup/signin, Google ও GitHub OAuth configuration।
8. **Protected routes:** product details, profile এবং profile update-এর জন্য login check।
9. **Profile update:** নিজের নাম পরিবর্তন করার সুবিধা।
10. **UX states:** skeleton loaders, toast notifications এবং friendly 404/empty states।
11. **Bengali UI:** বাংলা লেবেল ও বাংলা অঙ্কে মূল্য দেখানো।
12. **SEO basics:** page title, description এবং App Router metadata।

## 🧰 Technologies

- Next.js App Router
- React + TypeScript
- MongoDB + Better Auth MongoDB adapter
- Tailwind CSS v4 (plus custom responsive CSS)
- Better Auth
- react-hot-toast
- Lucide React
- BazarDor API

## 🚀 Local setup

**Requirements:** Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `BETTER_AUTH_SECRET` to a random secret of at least 32 characters and configure `MONGODB_URI` with a MongoDB Atlas or local MongoDB connection string. The database name defaults to `bazardor` and can be changed with `MONGODB_DATABASE`. For production, set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your deployed URL. `BAZARDOR_API_URL` defaults to the assignment API.

## 🔐 Google and GitHub login

Create OAuth apps in Google Cloud Console and GitHub Developer Settings. Add their credentials to `.env.local`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Set each provider's OAuth callback URL to:

`https://YOUR_DOMAIN/api/auth/callback/google`

`https://YOUR_DOMAIN/api/auth/callback/github`

Social buttons require valid provider credentials; email/password authentication works independently. Better Auth uses MongoDB through `mongodbAdapter`. Ensure your MongoDB user has read/write access to the configured database and that your deployment IP/network access is allowed in MongoDB Atlas. Do not use the development secret in production.

## 🌐 API

Base URL: `https://api.api-store.workers.dev/api/bazardor`

- `GET /products` — all products
- `GET /categories` — all categories
- `GET /categories/:id` — one category
- `GET /products?category=chal` — category filter (available in upstream API)
- `GET /products/:id` — one product

The API adapter accepts common field names and normalizes prices, units, category, market prices and change percentage. If the upstream JSON field names differ, update `normalizeProduct()` and `getCategories()` in `src/lib/products.ts`.

## 📦 Build and deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add production environment variables: `MONGODB_URI`, `MONGODB_DATABASE`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, and OAuth credentials if needed.
4. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your final HTTPS domain.
5. Deploy. App Router dynamic routes are implemented in `src/app/product/[slug]` and `src/app/category/[slug]`; refresh/reload should be handled by Next.js.
6. Run `npm run build` locally before submitting.

## 🗂️ Project structure

```text
src/
  app/
    api/auth/[...all]/route.ts
    api/products/route.ts
    category/[slug]/page.tsx
    product/[slug]/page.tsx
    profile/page.tsx
    profile/update/page.tsx
    signin/page.tsx
    signup/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
  lib/
```

## ⚠️ Notes

- Prices depend on the upstream API. If no change percentage is provided, the card displays a flat `— ০%` badge.
- If the API is unavailable, the home page shows an empty/error state instead of crashing.
- Authentication persistence in production requires a reachable MongoDB database. Review the official Better Auth MongoDB adapter and deployment instructions before production submission.
- Prices are indicative and may change with market conditions.
