# CueSync

Simple, mobile-first ecommerce site for pool and billiard accessories.

**Domain:** [cuesync.pro](https://cuesync.pro)

## Flow

1. Customer scans the QR code at your shop → opens the catalogue
2. Browse products, add to cart
3. Checkout with M-Pesa (mock STK push for now)

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/shop` | Product catalogue (QR destination) |
| `/cart` | Shopping cart |
| `/checkout` | M-Pesa payment |
| `/qr` | Printable/downloadable QR code |
| `/order/success` | Order confirmation |

## Shop assistant (AI chatbot)

Floating chat on every page — answers product questions and takes preorders.

1. Copy `.env.example` to `.env.local`
2. Add your [OpenAI API key](https://platform.openai.com/api-keys)
3. Restart the dev server

Preorders are logged server-side (console for now). Wire `src/lib/preorders.ts` to email or a database when you go live.

## Products

Edit [`src/data/products.json`](src/data/products.json) to add or update items.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

Deploy to Vercel (or any Node host) and point **cuesync.pro** to it.

The QR code at `/qr` links to `https://cuesync.pro/shop`.

## PWA (installable app)

CueSync is a Progressive Web App. On mobile, users can **Add to Home Screen** / **Install** for a full-screen shop experience.

- **Manifest:** `src/app/manifest.ts` — opens to `/shop` when launched from home screen
- **Service worker:** `public/sw.js` — caches static assets and offline fallback
- **Install prompt:** shown on supported browsers when eligible
- **Icons:** `public/icons/` — regenerate with `npm run icons`

Requires **HTTPS** in production (localhost works for dev).

## M-Pesa (live)

Checkout is currently **mock mode**. To go live, wire up Safaricom Daraja STK Push in `src/app/api/checkout/route.ts` with your consumer key, secret, and passkey.
