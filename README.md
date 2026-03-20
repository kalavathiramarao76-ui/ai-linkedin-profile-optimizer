# ProfileAI - AI-Powered LinkedIn Profile Optimizer

A production-ready SaaS application that uses AI to analyze, score, and optimize LinkedIn profiles. Built with Next.js 14, Tailwind CSS, and AI-powered content generation.

## Features

- **Profile Analyzer** - Paste your LinkedIn profile text and get a comprehensive AI analysis with scores (0-100) across headline, summary, experience, skills, and keywords
- **Headline Generator** - Generate 10 compelling, keyword-rich LinkedIn headlines tailored to your target role
- **Summary Writer** - Get professional summaries in 3 tones: professional, creative, and executive
- **Keyword Optimizer** - Discover missing keywords and optimize for recruiter searches
- **Score Dashboard** - Visual radar chart showing your strengths and areas for improvement
- **Copy to Clipboard** - One-click copy for all generated content

## Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components)
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI**: Server-side API routes calling Ollama-compatible endpoint
- **Database**: Prisma + PostgreSQL (Neon)
- **Auth**: NextAuth.js (Google OAuth)
- **Payments**: Stripe integration
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (optional - app works without it)

### Installation

```bash
git clone https://github.com/kalavathiramarao76-ui/ai-linkedin-profile-optimizer.git
cd ai-linkedin-profile-optimizer
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (Neon recommended)
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe keys
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

### Database Setup (Optional)

```bash
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Profile analysis endpoint
│   │   ├── generate/route.ts     # Content generation endpoint
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   └── webhooks/stripe/      # Stripe webhooks
│   ├── app/
│   │   ├── page.tsx              # Dashboard
│   │   ├── analyze/page.tsx      # Profile analyzer
│   │   ├── results/[id]/page.tsx # Results view
│   │   ├── headlines/page.tsx    # Headline generator
│   │   └── summary/page.tsx      # Summary writer
│   ├── pricing/page.tsx          # Pricing page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── landing/                  # Landing page components
│   └── dashboard/                # Dashboard components
├── lib/
│   ├── ai.ts                     # AI API client
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client
│   ├── rate-limit.ts             # Rate limiting
│   └── utils.ts                  # Utilities
└── prisma/
    └── schema.prisma             # Database schema
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The app is configured for Vercel deployment out of the box.

## License

MIT
