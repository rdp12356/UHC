# Vercel Deployment Setup for UHC

This guide explains how to deploy the UHC healthcare platform to Vercel.

## Prerequisites

1. **GitHub Account**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Neon PostgreSQL**: Ensure you have a Neon database account (or PostgreSQL elsewhere)

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/uhc-healthcare.git
git push -u origin main
```

### 2. Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select "Other" or "Express" as framework (Vite is auto-detected)
4. Click "Deploy"

### 3. Configure Environment Variables

In Vercel project settings, add these environment variables:

**Essential:**
- `DATABASE_URL`: Your Neon PostgreSQL connection string
  ```
  postgresql://user:password@host.neon.tech/dbname?sslmode=require
  ```

**Optional:**
- `NODE_ENV=production` (auto-set)

### 4. Run Database Migrations

After first deployment, run migrations in Vercel Shell or locally:

```bash
npm run db:push
```

This creates all required tables in your Neon database.

## Project Structure for Vercel

```
├── client/              # React frontend (Vite)
├── server/              # Express backend
├── shared/              # Shared types and schemas
├── script/              # Build scripts
├── dist/                # Build output (server + client)
├── vercel.json          # Vercel configuration
└── package.json
```

## How It Works on Vercel

1. **Frontend**: React app built with Vite, served as static files
2. **Backend**: Express server bundled as serverless function(s)
3. **Database**: Neon PostgreSQL (always on, supports multiple concurrent connections)
4. **API Routes**: All `/api/*` requests routed to the Express server

## Build Output

The build process creates:
- `/dist/public/` - Frontend static files (served automatically)
- `/dist/index.cjs` - Express server (serverless handler)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon IP allowlist (allow all if needed)
- Ensure Neon database exists with correct tables

### 404 on API Routes
- Verify `vercel.json` rewrite rules
- Check that `/api/*` routes are defined in `server/routes.ts`

### Build Failures
- Check Vercel build logs for errors
- Ensure all dependencies are listed in `package.json`
- Run `npm run build` locally to test

### Environment Variables Not Found
- Add variables in Vercel Project Settings (not in .env file)
- Restart deployment after adding variables

## Development vs Production

The app automatically detects the environment:
- **Development** (LOCAL): Uses Replit features and development plugins
- **Production** (VERCEL): Clean Express server, optimized static serving

## Monitoring

After deployment:
1. Check function logs in Vercel dashboard
2. Monitor database connections on Neon dashboard
3. Set up error tracking (optional: Sentry, LogRocket, etc.)

## Updating Your Deployment

Every time you push to `main` branch:
1. Vercel automatically builds and deploys
2. Database schema stays the same (no auto-migrations in production)
3. Previous deployments archived (can rollback if needed)

## Performance Tips

1. **Database**: Use connection pooling via Neon
2. **API**: Response times typically 200-500ms
3. **Frontend**: Served via Vercel CDN (cached globally)
4. **Cold Starts**: Initial request ~2-5s, subsequent <500ms

## Security Checklist

- ✅ DATABASE_URL never exposed in code (use Vercel env vars)
- ✅ HTTPS enforced automatically by Vercel
- ✅ API routes require proper authentication
- ✅ Session cookies secured in production

## Custom Domain

To add a custom domain:
1. Go to Vercel project → Settings → Domains
2. Add your domain and follow DNS setup
3. Vercel auto-manages SSL certificates

For help, visit [Vercel Documentation](https://vercel.com/docs)
