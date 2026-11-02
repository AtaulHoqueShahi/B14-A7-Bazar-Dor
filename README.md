# বাজার দর (BazarDor)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, দাম পরিবর্তন এবং বাজারভিত্তিক দামের তথ্য এক জায়গায় দেখার responsive web app.

## লিংক

- **Live site:** https://b14-a7-bazar-dor-g5fr.vercel.app/
- **GitHub:** https://github.com/AtaulHoqueShahi/B14-A7-Bazar-Dor

## প্রধান ফিচার

1. API থেকে পণ্যের বর্তমান দাম ও আগের দিনের পরিবর্তন দেখা।
2. দাম বাড়া/কমা পণ্য, সব পণ্যের তালিকা এবং scrolling price ticker।
3. ক্যাটাগরি অনুযায়ী পণ্য দেখা এবং বাংলা সংখ্যা সমর্থিত দাম sorting।
4. পণ্যের সর্বনিম্ন, সর্বোচ্চ, গড় ও বাজারভিত্তিক দাম দেখা।
5. Better Auth দিয়ে email/password, Google ও GitHub sign-in।
6. Login-protected product details এবং profile name update।
7. Mobile, tablet ও desktop-এর জন্য responsive layout।

## প্রযুক্তি

Next.js App Router, React, TypeScript, Tailwind CSS, DaisyUI, Better Auth, MongoDB, react-hot-toast, Lucide React।

## লোকালি চালানো

```bash
git clone https://github.com/AtaulHoqueShahi/B14-A7-Bazar-Dor.git
cd B14-A7-Bazar-Dor
npm install
```

`.env.local` ফাইল তৈরি করে নিচের মানগুলো বসাও। Secret বা OAuth credential GitHub-এ commit কোরো না।

```dotenv
MONGODB_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
MAIN_API_URL=https://openapi.programming-hero.com/api/bazardor
BASE_URL_1=https://api.api-store.workers.dev/api/bazardor
BASE_URL_2=https://api.abcz.workers.dev/api/bazardor
NEXT_PUBLIC_MAIN_API_URL=https://openapi.programming-hero.com/api/bazardor
NEXT_PUBLIC_BASE_URL_1=https://api.api-store.workers.dev/api/bazardor
NEXT_PUBLIC_BASE_URL_2=https://api.abcz.workers.dev/api/bazardor
```

তারপর development server চালাও:

```bash
npm run dev
```

ব্রাউজারে `http://localhost:3000` খোলো। Deploy করার সময় একই server-side variables Vercel-এর Project Settings → Environment Variables-এ যোগ করতে হবে।

## OAuth callback URLs

Google ও GitHub OAuth settings-এ callback URL হিসেবে যোগ করো:

- Local: `http://localhost:3000/api/auth/callback/google` এবং `http://localhost:3000/api/auth/callback/github`
- Production: `https://b14-a7-bazar-dor-g5fr.vercel.app/api/auth/callback/google` এবং `https://b14-a7-bazar-dor-g5fr.vercel.app/api/auth/callback/github`

## API

পণ্যের data BazarDor API থেকে আসে: `https://openapi.programming-hero.com/api/bazardor`। বিকল্প API endpoint-গুলো environment variables দিয়ে configure করা যায়।

## লেখক

Ataul Hoque Shahi — [GitHub](https://github.com/AtaulHoqueShahi)
