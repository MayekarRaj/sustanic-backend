# Deployment Guide

Complete guide for deploying the Water Kiosk Backend to Render and Neon.

> **For team deployment with Docker (local) + Neon + Render workflow, see:**
> 👉 **[TEAM_DEPLOYMENT.md](./TEAM_DEPLOYMENT.md)** - Complete team setup and workflow guide

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- Neon account (sign up at https://neon.tech)

## Step 1: Set up Neon PostgreSQL Database

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up or log in
   - Create a new project

2. **Create Database**
   - Click "Create Project"
   - Choose a project name (e.g., "water-kiosk")
   - Select a region closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - After project creation, you'll see the connection string
   - It looks like: `postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/water_kiosk?sslmode=require`
   - **Save this connection string** - you'll need it for Render

4. **Note the Connection Details**
   - Database name: Usually `neondb` or your project name
   - You can also find connection details in the "Connection Details" section

## Step 2: Prepare Your Code Repository

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Water Kiosk Backend"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Verify Important Files**
   - `package.json` exists
   - `Dockerfile` exists (optional, Render can build without it)
   - `.env.example` exists
   - `prisma/schema.prisma` exists

## Step 3: Deploy to Render

### 3.1 Create Web Service

1. **Go to Render Dashboard**
   - Log in to https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account if not already connected
   - Select your repository
   - Click "Connect"

3. **Configure Service**

   **Basic Settings:**
   - **Name**: `water-kiosk-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npx prisma generate
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

   **Advanced Settings:**
   - **Environment**: `Node`
   - **Node Version**: `20` (or latest LTS)

### 3.2 Set Environment Variables

In the Render dashboard, go to "Environment" tab and add:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-neon-connection-string>
JWT_SECRET=<generate-a-strong-random-secret>
JWT_EXPIRES_IN=7d
ALLOWED_QUANTITIES=500,1000,2000
MIN_WALLET_BALANCE=0
```

**Important Notes:**
- Replace `<your-neon-connection-string>` with the actual connection string from Neon
- For `JWT_SECRET`, generate a strong random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Render uses port 10000 by default, but the app will use the PORT env variable

### 3.3 Deploy

1. Click "Create Web Service"
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your service URL will be: `https://water-kiosk-backend.onrender.com` (or your custom name)

## Step 4: Run Database Migrations

After the first deployment, you need to run Prisma migrations:

### Option 1: Using Render Shell (Recommended)

1. Go to your service in Render dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Using Local Machine

1. Set up local `.env` with Neon connection string
2. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Option 3: Add to Build Command

You can also add migration to the build command:

```bash
npm install && npm run build && npx prisma generate && npx prisma migrate deploy
```

**Note:** For production, use `prisma migrate deploy` instead of `prisma migrate dev`.

## Step 5: Seed Database (Optional)

If you want to seed the database with sample data:

1. Go to Render Shell
2. Run:
   ```bash
   npm run prisma:seed
   ```

Or from local machine (with Neon connection string in `.env`):
```bash
npm run prisma:seed
```

## Step 6: Verify Deployment

1. **Health Check**
   ```bash
   curl https://your-service.onrender.com/health
   ```

2. **Test Login**
   ```bash
   curl -X POST https://your-service.onrender.com/auth/scan-login \
     -H "Content-Type: application/json" \
     -d '{"scan_code": "QR_USER_001"}'
   ```

## Step 7: Set up Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in Render environment variables
- Check if Neon database is paused (free tier pauses after inactivity)
- Ensure connection string includes `?sslmode=require` for Neon

### Build Failures

- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version matches (check `package.json` engines if specified)

### Migration Issues

- Make sure `DATABASE_URL` is set correctly
- Run `npx prisma migrate deploy` manually
- Check Prisma migration status: `npx prisma migrate status`

### Service Crashes

- Check logs in Render dashboard
- Verify all environment variables are set
- Check if port is correctly configured (Render uses PORT env var)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` (Render default) |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for JWT signing | Random 32+ char string |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `ALLOWED_QUANTITIES` | Comma-separated quantities | `500,1000,2000` |
| `MIN_WALLET_BALANCE` | Minimum wallet balance | `0` |

## Cost Considerations

### Render Free Tier
- 750 hours/month free
- Services sleep after 15 minutes of inactivity
- Good for development/testing

### Render Paid Tier
- Starts at $7/month
- Always-on service
- Better for production

### Neon Free Tier
- 0.5 GB storage
- Shared CPU
- Good for development

### Neon Paid Tier
- More storage and compute
- Better performance
- Recommended for production

## Security Checklist

- [ ] Strong `JWT_SECRET` (32+ characters, random)
- [ ] `DATABASE_URL` is secure (not exposed in logs)
- [ ] HTTPS enabled (automatic on Render)
- [ ] Environment variables are set (not hardcoded)
- [ ] Database has strong password
- [ ] Consider adding rate limiting for production
- [ ] Enable CORS restrictions if needed

## Monitoring

1. **Render Logs**
   - View real-time logs in Render dashboard
   - Set up log drains for external services

2. **Health Checks**
   - Use `/health` endpoint for monitoring
   - Set up uptime monitoring (e.g., UptimeRobot)

3. **Database Monitoring**
   - Monitor Neon dashboard for database metrics
   - Set up alerts for connection issues

## Next Steps

After successful deployment:

1. Set up CI/CD (optional)
2. Add monitoring and alerting
3. Configure backups for database
4. Set up staging environment
5. Add rate limiting
6. Implement logging service (e.g., Logtail, Datadog)

## Support

- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs

