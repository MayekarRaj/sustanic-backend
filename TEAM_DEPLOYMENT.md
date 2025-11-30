# Team Deployment Guide: Neon (All Environments) + Render (Production)

Complete guide for team development and production deployment using Neon.

## 🎯 Architecture Overview

- **Local Development**: Neon PostgreSQL (shared or individual databases)
- **Production**: Neon PostgreSQL + Render Backend
- **Staging** (optional): Separate Neon database + Render instance

---

## 📋 Part 1: Local Development Setup (Each Team Member)

### Prerequisites
- Node.js 20+
- Neon account (free) - [Sign up here](https://neon.tech)
- Git

### Option A: Shared Development Database (Recommended for Small Teams)

All team members use the same Neon database for development.

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Get shared development database connection string**
   - Team lead creates a Neon project: `water-kiosk-dev`
   - Shares connection string with team (via secure channel)

3. **Set up environment**
   ```bash
   cp env.example .env
   ```
   
   Your `.env` should have:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

4. **Install and set up**
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

✅ **You're now running with Neon database!**

### Option B: Individual Development Databases

Each developer has their own Neon database.

1. **Create your own Neon project**
   - Sign up at [neon.tech](https://neon.tech)
   - Create project: `water-kiosk-dev-[your-name]`
   - Copy connection string

2. **Set up environment**
   ```bash
   cp env.example .env
   ```
   
   Paste your connection string in `.env`

3. **Install and set up** (same as Option A)

### Daily Workflow

```bash
# Start dev server
npm run dev

# View database
npm run prisma:studio
```

### Handling Database Migrations

When someone adds a new migration:

```bash
# Pull latest changes
git pull

# Generate Prisma Client (if schema changed)
npm run prisma:generate

# Apply new migrations
npm run prisma:migrate
```

**Note:** With shared development database, coordinate migrations with team to avoid conflicts.

---

## 🚀 Part 2: Production Deployment (One-Time Setup)

### Step 1: Create Neon Production Database

1. **Sign up at [neon.tech](https://neon.tech)**
   - Create account (free tier is fine)

2. **Create Production Project**
   - Click "Create Project"
   - Name: `water-kiosk-production`
   - Region: Choose closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - After creation, you'll see a connection string like:
     ```
     postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - **Save this securely** - you'll need it for Render

4. **Test Connection** (Optional)
   ```bash
   # Temporarily update .env with Neon connection string
   DATABASE_URL="your-neon-connection-string"
   
   # Test connection
   npx prisma db pull
   
   # Revert to local for development
   DATABASE_URL="postgresql://user:password@localhost:5432/water_kiosk?schema=public"
   ```

### Step 2: Deploy Backend to Render

1. **Sign up at [render.com](https://render.com)**
   - Connect your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select the `backend` folder (or root if monorepo)

3. **Configure Service**

   **Basic Settings:**
   - **Name**: `water-kiosk-backend`
   - **Region**: Choose closest to Neon database region
   - **Branch**: `main` (or your production branch)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npx prisma generate
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

4. **Set Environment Variables**

   Go to "Environment" tab and add:

   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-neon-production-connection-string>
   JWT_SECRET=<generate-strong-random-secret>
   JWT_EXPIRES_IN=7d
   ALLOWED_QUANTITIES=500,1000,2000
   MIN_WALLET_BALANCE=0
   ```

   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for first deployment (2-5 minutes)

### Step 3: Run Production Migrations

After first deployment:

1. **Option A: Using Render Shell** (Recommended)
   - Go to Render dashboard → Your service
   - Click "Shell" tab
   - Run:
     ```bash
     npx prisma migrate deploy
     ```

2. **Option B: From Local Machine**
   ```bash
   # Temporarily set Neon connection
   export DATABASE_URL="your-neon-connection-string"
   
   # Deploy migrations
   npx prisma migrate deploy
   
   # Unset (revert to local)
   unset DATABASE_URL
   ```

3. **Seed Production Database** (Optional)
   ```bash
   # In Render Shell or locally with Neon connection
   npm run prisma:seed
   ```

### Step 4: Verify Production

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

✅ **Production is live!**

---

## 🔄 Part 3: Team Workflow

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-endpoint
   ```

2. **Develop locally** (with Docker PostgreSQL)
   ```bash
   docker-compose up -d postgres
   npm run dev
   ```

3. **Create database migration** (if schema changed)
   ```bash
   npm run prisma:migrate
   # This creates a new migration file
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-endpoint
   ```

5. **Create Pull Request**
   - PR gets reviewed
   - Merge to `main`

6. **Deploy to production**
   - Render auto-deploys on `main` branch push
   - Run migrations in Render Shell:
     ```bash
     npx prisma migrate deploy
     ```

### Database Migration Workflow

**When you add a new migration:**

1. **Developer creates migration**
   ```bash
   npm run prisma:migrate
   # Creates: prisma/migrations/YYYYMMDDHHMMSS_migration_name/
   ```

2. **Commit migration files**
   ```bash
   git add prisma/migrations/
   git commit -m "Add migration: description"
   git push
   ```

3. **Team members pull and apply**
   ```bash
   git pull
   npm run prisma:migrate  # Applies new migration locally
   ```

4. **Production deployment**
   - Render auto-deploys
   - Run in Render Shell: `npx prisma migrate deploy`

### Environment Management

**Local Development:**
- `.env` file (gitignored)
- Uses Neon PostgreSQL (shared or individual)
- `DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"`

**Production:**
- Environment variables in Render dashboard
- Uses Neon PostgreSQL (separate production database)
- `DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"`

**Never commit:**
- `.env` files
- Production secrets
- Database credentials

---

## 🧪 Part 4: Staging Environment (Optional)

For testing before production:

### Create Staging Database

1. **Create second Neon project**
   - Name: `water-kiosk-staging`
   - Get connection string

2. **Create Staging Service in Render**
   - Duplicate production service
   - Name: `water-kiosk-backend-staging`
   - Use staging database connection string
   - Deploy from `staging` branch (or different branch)

3. **Workflow**
   - Test features in staging first
   - Deploy to production after staging approval

---

## 📊 Part 5: Monitoring & Maintenance

### Health Checks

**Production:**
```bash
curl https://your-service.onrender.com/health
```

**Local:**
```bash
curl http://localhost:3000/health
```

### Database Management

**View local database:**
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

**View production database:**
- Use Neon dashboard (browser-based SQL editor)
- Or connect Prisma Studio to production:
  ```bash
  DATABASE_URL="production-neon-connection-string" npx prisma studio
  ```

### Logs

**Render Logs:**
- Dashboard → Your service → Logs tab
- Real-time logs available

**Local Logs:**
- Console output from `npm run dev`
- Neon dashboard → Logs (for database queries)

### Backups

**Neon:**
- Automatic backups (free tier: 7-day retention)
- Manual backups via Neon dashboard

**Local:**
- Docker volume persists data
- Manual backup:
  ```bash
  docker-compose exec postgres pg_dump -U user water_kiosk > backup.sql
  ```

---

## 🔐 Part 6: Security Best Practices

### Environment Variables

✅ **Do:**
- Store secrets in Render environment variables
- Use strong JWT_SECRET (32+ characters)
- Rotate secrets periodically
- Use different secrets for staging/production

❌ **Don't:**
- Commit `.env` files
- Share connection strings in chat/email
- Use weak secrets
- Reuse local secrets in production

### Database Security

- Use strong passwords (Neon generates these)
- Enable SSL (Neon requires `sslmode=require`)
- Limit database access to Render IPs (if possible)
- Regular security updates

### API Security

- Always use HTTPS in production (Render provides this)
- Validate all inputs (already implemented with Zod)
- Rate limiting (consider adding for production)
- CORS configuration (update for production domains)

---

## 🚨 Troubleshooting

### Local Issues

**Database connection error:**
- Check Neon dashboard - database might be paused
- Click "Resume" or "Wake up" in Neon dashboard
- Verify `DATABASE_URL` in `.env` is correct
- Ensure connection string includes `?sslmode=require`

**Migration conflicts (shared database):**
- Coordinate with team before running migrations
- Check migration status: `npx prisma migrate status`
- If needed, reset development database (WARNING: affects all team members)
  - Use Neon dashboard SQL editor or Prisma Studio

### Production Issues

**Render deployment fails:**
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check Node version compatibility

**Database connection errors:**
- Verify `DATABASE_URL` in Render environment variables
- Check Neon database is not paused
- Verify connection string format

**Migration errors:**
- Check migration status: `npx prisma migrate status`
- Review migration files for conflicts
- Run `npx prisma migrate deploy` in Render Shell

---

## 📝 Quick Reference

### Local Commands
```bash
# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start dev server
npm run dev

# View database
npm run prisma:studio
```

### Production Commands (Render Shell)
```bash
# Deploy migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Seed database
npm run prisma:seed

# View logs
# (Use Render dashboard Logs tab)
```

### Environment Variables

**Local (.env):**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Production (Render):**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

---

## ✅ Deployment Checklist

### Initial Setup
- [ ] Neon production database created
- [ ] Render service created and configured
- [ ] Environment variables set in Render
- [ ] First deployment successful
- [ ] Migrations deployed to production
- [ ] Production health check passing
- [ ] Test login working in production

### For Each Feature
- [ ] Feature tested locally (Docker)
- [ ] Migrations created (if needed)
- [ ] Code reviewed and merged
- [ ] Render auto-deployed
- [ ] Production migrations deployed
- [ ] Feature tested in production

---

## 🎓 Next Steps

1. **Set up CI/CD** (optional)
   - GitHub Actions for automated testing
   - Auto-deploy on PR merge

2. **Add Monitoring**
   - Uptime monitoring (UptimeRobot)
   - Error tracking (Sentry)
   - Analytics

3. **Scale Up**
   - Upgrade Neon tier if needed
   - Upgrade Render tier for always-on
   - Add CDN if needed

---

**You're all set!** 🎉

- Developers use Docker locally
- Production runs on Render + Neon
- Team can collaborate seamlessly

