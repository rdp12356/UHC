# UHC Platform Deployment Guide

## Quick Start: Deploy to Vercel

### Prerequisites
- GitHub account with your code pushed to a repository
- Vercel account (free at vercel.com)
- Neon PostgreSQL database (free at neon.tech)

### Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project and database
3. Copy your connection string (looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

### Step 2: Deploy to Vercel

1. Push your code to GitHub:
```bash
git push origin main
```

2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Click "Deploy"

### Step 3: Add Environment Variables

In Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add variable: `DATABASE_URL` = (your Neon connection string from Step 1)
3. Redeploy the project

### Step 4: Run Database Migrations

Option A: Using Vercel CLI:
```bash
vercel env pull
npm run db:push
```

Option B: Using Neon directly:
- The migrations run automatically on first deploy
- Or manually run migrations in Neon console

### ✅ Done!

Your app is now live at: `https://your-project.vercel.app`

## Troubleshooting

**Q: Getting 404 errors on API routes?**
- A: Verify DATABASE_URL is set in Vercel environment variables
- Redeploy after adding environment variables

**Q: Database connection refused?**
- A: Check Neon IP allowlist in database settings
- Ensure connection string includes `sslmode=require`

**Q: Frontend shows but API doesn't work?**
- A: Check Vercel function logs in deployment
- Verify server is properly built in dist/ folder

## File Structure

```
dist/
  ├── index.cjs          ← Express server (serverless function)
  └── public/            ← React frontend (static files)
api/
  └── index.js           ← Vercel handler
vercel.json             ← Deployment config
```

## Monitoring

1. **Vercel Dashboard**: View deployment status, function logs, analytics
2. **Neon Dashboard**: Monitor database connections and performance
3. **Logs**: Check Function Logs in Vercel for any errors

## Next Steps

- Set up custom domain (Settings → Domains in Vercel)
- Configure CI/CD (auto-deploy on git push)
- Monitor performance and database usage
- Scale as needed (Vercel handles scaling automatically)

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- Check Vercel deployment logs for specific errors
