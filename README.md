# PacePoint - Running Event Platform

A modern web platform for managing running events, built with Next.js, TypeScript, and Supabase.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/fauzilxxs-projects/v0-running-event-platform-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/hMDUeCdafBX)

## Features

✅ Event browsing and registration  
✅ User authentication (Runner & Organizer roles)  
✅ Event management for organizers  
✅ Payment processing  
✅ Blog with running tips and event recaps  
✅ Responsive design with dark mode support  
✅ Server-side route protection  
✅ Real-time data with Supabase

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Data Fetching**: SWR
- **Form Handling**: React Hook Form + Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd v0-running-event-platform-ui
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Then fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase database**
   
   Run the SQL scripts in order:
   - First, run `supabase/schema.sql` in your Supabase SQL Editor
   - Then, optionally run `supabase/seed.sql` for sample data

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed database configuration instructions.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── blog/              # Blog pages
│   ├── events/            # Event pages
│   ├── organizer/         # Organizer dashboard
│   ├── runner/            # Runner dashboard
│   ├── login/             # Authentication
│   └── register/          # Registration
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── api/              # API functions
│   └── supabase.ts       # Supabase client
├── supabase/             # Database schemas
└── middleware.ts         # Route protection

```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deployment

The app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy!

**Live Demo**: [https://vercel.com/fauzilxxs-projects/v0-running-event-platform-ui](https://vercel.com/fauzilxxs-projects/v0-running-event-platform-ui)

## Contributing

This project is currently in active development. Contributions are welcome!

## License

MIT License
