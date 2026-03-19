# ReplyAI

ReplyAI is an AI-powered email reply generator SaaS for Nigerian professionals. Users paste an email they received, pick a tone, and get 3 professional reply drafts instantly.

## Features
- **Instant Drafts:** Generates 3 reply drafts per request, tailored to varying depths.
- **Smart Tones:** Select from Professional, Friendly, Firm, Apologetic, or provide a Custom context.
- **Auth & Usage:** Google/Email auth via Firebase. Everyone gets 5 free drafts monthly.
- **Billing:** Buy Pay-As-You-Go credit packs via Paystack (NGN).
- **History:** View past generations from your Dashboard.

## Local Setup

### 1. Clone & Install
```bash
cd replyai
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` at the root, and configure your keys.

- **Gemini:** [console.cloud.google.com](https://console.cloud.google.com) → Enable Generative AI API → Create API key
- **Firebase:** [console.firebase.google.com](https://console.firebase.google.com) → Project settings → Service accounts → Generate key (paste JSON string into `FIREBASE_SERVICE_ACCOUNT_JSON`)
- **Paystack:** [dashboard.paystack.com](https://dashboard.paystack.com) → Settings → API keys
- **Neon Postgres:** [neon.tech](https://neon.tech) → New project → Copy `DATABASE_URL`

### 3. Database
```bash
cd server
npm run db:push
```

### 4. Run Locally
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## Production Deployment

- **Backend (Render):** Uses `render.yaml`. Simply connect to GitHub and Render will detect settings. Ensure all Environment variables are set in Render dashboard.
- **Frontend (Vercel):** Import the `client` folder to Vercel. Vercel picks up `vercel.json`. Configure VITE_ environment variables.

## Monetisation Model
- **Free:** 5 generations/month (resets 1st of month)
- **Starter (₦1,500):** 30 credits
- **Pro (₦3,500):** 100 credits
- **Power (₦8,000):** 300 credits
_1 credit = 3 drafts._

## Roadmap
- Browser extension for Gmail/Outlook integration
- WhatsApp bot interface
- Web scraper context injector
- Voice-to-email tool
