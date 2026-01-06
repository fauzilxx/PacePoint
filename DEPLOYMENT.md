# Deployment Guide

## 1. Backend Deployment (Railway)

**Repository Setup:**
- Connect your GitHub repository to Railway.

**Service Configuration:**
- **Root Directory:** `/backend`
- **Build Command:** `npm install` (or leave empty if Railway auto-detects)
- **Start Command:** `npm start`
- **Watch Paths:** `/backend/**` (Optional, for auto triggers)

**Environment Variables:**
| Variable | Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3001` (or Railway variable) | Port to listen on. Railway provides this automatically. |
| `FRONTEND_BASE_URL` | `https://your-frontend-project.vercel.app` | The URL of your deployed frontend. |

## 2. Frontend Deployment (Vercel)

**Repository Setup:**
- Connect your GitHub repository to Vercel.

**Project Configuration:**
- **Framework Preset:** Next.js
- **Root Directory:** `./` (default)
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (or `pnpm install`)

**Environment Variables:**
| Variable | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-project.up.railway.app` | The URL of your deployed backend. |

## 3. Post-Deployment Verification
1. Open the Frontend URL.
2. Go to `/payment/init`.
3. Generate a QR Code.
4. Scan with your phone (ensure it's not connected to localhost).
5. Verify the payment page opens and status updates on your desktop.
