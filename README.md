# 🥖 La Farine — Artisan Bakery Shop

A full-stack Next.js 14 bakery website with a beautiful storefront and a secure admin panel for managing menu items. Built to deploy on **Netlify** with **Supabase** as the database and image storage backend.

---

## ✨ Features

- **Storefront** — Hero, dynamic menu with category filters, about section, testimonials, contact
- **Admin Panel** — Secure login, add / edit / delete items, toggle availability, image uploads
- **Supabase** — PostgreSQL database + Storage bucket for product images
- **Netlify** — One-click deployment with the official Next.js plugin

---

## 📁 Project Structure

```
bakery-shop/
├── app/
│   ├── page.tsx                  # Storefront home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles + fonts
│   ├── admin/
│   │   ├── layout.tsx            # Auth guard (server)
│   │   ├── page.tsx              # Admin dashboard (server)
│   │   ├── AdminDashboard.tsx    # Dashboard UI (client)
│   │   └── login/
│   │       ├── page.tsx          # Login page
│   │       └── LoginForm.tsx     # Login form (client)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts    # POST /api/auth/login
│       │   └── logout/route.ts   # POST /api/auth/logout
│       └── items/route.ts        # GET/POST/PUT/PATCH/DELETE
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── MenuSection.tsx
│   ├── AboutSection.tsx
│   └── ExtraSections.tsx
├── lib/
│   ├── supabase.ts               # Supabase clients + types
│   └── auth.ts                   # Cookie-based auth helper
├── supabase-schema.sql           # Run this in Supabase SQL Editor
├── netlify.toml                  # Netlify build config
└── .env.example                  # Copy to .env.local
```

---

## 🚀 Setup Guide

### 1 — Clone & install

```bash
git clone <your-repo-url>
cd bakery-shop
npm install
```

---

### 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Note your **Project URL** and **anon public key** from  
   `Settings → API`
3. Also copy the **service_role secret key** (keep this private)

---

### 3 — Run the SQL schema

1. In your Supabase dashboard → **SQL Editor** → **New Query**
2. Paste the contents of `supabase-schema.sql` and click **Run**

This creates:
- `bakery_items` table with RLS policies
- `bakery-images` storage bucket (public read)
- Optional seed data (8 starter items)

---

### 4 — Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
# From Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin login credentials (you choose these)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Random secret string — used to sign the session cookie
# Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=your_random_64_char_hex_string
```

> ⚠️ **Never commit `.env.local` to git.** The `.env.example` file is safe to commit.

---

### 5 — Run locally

```bash
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

### 6 — Deploy to Netlify

#### Option A — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

#### Option B — Netlify Dashboard (easier)

1. Push your project to a GitHub / GitLab repo
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Select your repo
4. Build settings are auto-detected via `netlify.toml`
5. Go to **Site settings → Environment variables** and add all five variables from your `.env.local`
6. Click **Deploy site**

> The `netlify.toml` file already includes `@netlify/plugin-nextjs` which handles API routes, SSR, and image optimisation automatically.

---

## 🔐 Admin Panel Usage

| Action | How |
|---|---|
| **Login** | `/admin/login` with your `ADMIN_USERNAME` / `ADMIN_PASSWORD` |
| **Add item** | Click **Add Item**, fill the form, upload an image, save |
| **Edit item** | Click the ✏️ pencil icon on any row |
| **Delete item** | Click the 🗑️ trash icon — confirms before deleting, removes image from storage too |
| **Toggle visibility** | Click the Live / Hidden toggle to show or hide items from the storefront |
| **Logout** | Top-right **Logout** button |

---

## 🗄️ Database Schema

```sql
bakery_items (
  id          UUID PRIMARY KEY,
  name        TEXT,
  description TEXT,
  price       NUMERIC(10,2),
  category    TEXT,           -- Bread | Pastry | Cake | Cookie | Seasonal
  image_url   TEXT,           -- Public URL from Supabase Storage
  available   BOOLEAN,        -- Controls storefront visibility
  created_at  TIMESTAMPTZ
)
```

---

## 🎨 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Google Fonts |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Auth | Cookie-based (httpOnly, custom) |
| Hosting | Netlify |
| Icons | Lucide React |

---

## 🛠 Customisation Tips

- **Bakery name** — Search and replace `La Farine` across the codebase
- **Currency** — Replace `Nu.` with your currency symbol in `MenuSection.tsx` and `AdminDashboard.tsx`
- **Categories** — Edit the `CATEGORIES` array in `MenuSection.tsx` and `AdminDashboard.tsx`
- **Colours** — Edit `tailwind.config.ts` (`cream` and `brown` palette)
- **Location / hours** — Edit `ExtraSections.tsx` (`ContactSection`)
- **About copy** — Edit `AboutSection.tsx`
