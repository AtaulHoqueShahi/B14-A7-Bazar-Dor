This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


 
# 🛒 BazarDor – বাজার দর

BazarDor is a responsive web application that helps users explore daily market prices of essential products in Bangladesh. Users can browse products by category, check current prices, compare price changes, and manage their accounts.

## 🌐 Live Demo

- **Live Website:** [Add your deployed website URL]
- **GitHub Repository:** [Add your GitHub repository URL]

## ✨ Features

- Browse daily market prices of essential products.
- Explore products by categories.
- View product details and price information.
- Check price changes compared to previous prices.
- User registration and login system.
- Google and GitHub social authentication.
- User profile and profile update functionality.
- Responsive design for mobile, tablet, and desktop.
- Custom loading and 404 pages.
- Dynamic product data fetched from API.

## 🛠️ Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Better Auth
- MongoDB
- Lucide React
- REST API

## 📦 Dependencies

Main packages used in this project:

- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`
- `daisyui`
- `better-auth`
- `mongodb`
- `lucide-react`
- `react-hot-toast`

## ⚙️ Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd assinment-7
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

```

**Important:** Replace the placeholder values with your own credentials. Never commit `.env.local` or expose your secrets publicly.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

BazarDor uses Better Auth for authentication.

- Email and password registration.
- Email and password login.
- Google sign-in.
- GitHub sign-in.
- User session management.
- Profile information update.
- Sign out functionality.

Social login requires valid OAuth credentials.

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts
│   ├── category/
│   ├── product/
│   ├── sign-in/
│   ├── sign-up/
│   ├── profile/
│   ├── not-found.tsx
│   ├── loading.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   ├── auth.ts
│   ├── auth-cilent.ts
│   └── utils.ts
└── proxy.ts
```

## 📡 API

Product and category information is retrieved from the BazarDor API.

**Main API:**

```text
https://openapi.programming-hero.com/api/bazardor
```

Backup API endpoints are configured through environment variables.

## 👨‍💻 Author

**Ataul Hoque Shahi**

- GitHub: [AtaulHoqueShahi](https://github.com/AtaulHoqueShahi)


---
