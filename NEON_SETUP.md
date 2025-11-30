# Neon Database Setup Guide

Complete guide for setting up and using Neon as your primary database.

## 🎯 Why Neon?

- ✅ **No local setup** - Works immediately, no Docker or PostgreSQL installation
- ✅ **Free tier** - 0.5GB storage, perfect for development
- ✅ **Automatic backups** - Your data is safe
- ✅ **Accessible anywhere** - Work from any device
- ✅ **Production-ready** - Same database for dev and prod
- ✅ **Easy team collaboration** - Share connection strings securely
- ✅ **SQL editor** - Built-in browser-based SQL editor
- ✅ **Auto-pause** - Free tier pauses after inactivity (saves resources)

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (or "Log In" if you have an account)
3. Sign up with GitHub, Google, or email

### Step 2: Create Project

1. Click **"Create Project"**
2. Fill in:
   - **Project name**: `water-kiosk-dev` (or your preferred name)
   - **Region**: Choose closest to you (e.g., `US East (Ohio)`)
   - **PostgreSQL version**: 15 (default)
3. Click **"Create Project"**

### Step 3: Get Connection String

After project creation, you'll see:

1. **Connection string** displayed on screen
   - Looks like: `postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - **Copy this immediately** - you'll need it

2. **Alternative**: Go to **"Connection Details"** tab to see it again

### Step 4: Configure Your App

1. **Copy environment template**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` and paste your connection string**
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

3. **Install and set up**
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Start your server**
   ```bash
   npm run dev
   ```

✅ **You're done!** Your app is now connected to Neon.

---

## 🔄 Daily Workflow

### Starting Your Day

```bash
# 1. Check if Neon database is active
# Go to Neon dashboard - if paused, click "Resume"

# 2. Start your dev server
npm run dev

# 3. View database (optional, in separate terminal)
npm run prisma:studio
```

### Database is Paused?

Neon free tier auto-pauses after inactivity. To resume:

1. Go to [Neon Dashboard](https://console.neon.tech)
2. Find your project
3. Click **"Resume"** or **"Wake up"**
4. Wait 10-20 seconds
5. Your app will reconnect automatically

---

## 👥 Team Collaboration

### Option 1: Shared Development Database (Recommended)

**Best for:** Small teams, shared testing data

1. **Team lead creates Neon project**
   - Name: `water-kiosk-dev`
   - Shares connection string securely (password manager, encrypted channel)

2. **All team members use same connection string**
   - Everyone sees same data
   - Coordinate migrations to avoid conflicts

**Pros:**
- ✅ Everyone sees same data
- ✅ Easy to test together
- ✅ One database to manage

**Cons:**
- ⚠️ Need to coordinate migrations
- ⚠️ One person's test data affects others

### Option 2: Individual Development Databases

**Best for:** Larger teams, independent development

1. **Each developer creates their own Neon project**
   - Name: `water-kiosk-dev-[name]`
   - Each has their own connection string

2. **Everyone uses their own `.env`**
   - Independent development
   - No conflicts

**Pros:**
- ✅ No conflicts
- ✅ Independent development
- ✅ Can test without affecting others

**Cons:**
- ⚠️ More databases to manage
- ⚠️ Different data per developer

---

## 🛠️ Using Neon Dashboard

### SQL Editor

1. Go to Neon Dashboard → Your Project
2. Click **"SQL Editor"** tab
3. Write and run SQL queries directly in browser
4. View results instantly

**Example queries:**
```sql
-- View all users
SELECT * FROM users;

-- View wallet balances
SELECT u.name, w.balance 
FROM users u 
JOIN wallets w ON u.id = w.user_id;

-- View recent transactions
SELECT * FROM transactions 
ORDER BY created_at DESC 
LIMIT 10;
```

### Connection Details

- View connection strings
- Reset password
- See connection parameters

### Logs

- View query logs
- Monitor database activity
- Debug connection issues

### Settings

- Change project name
- Manage team members
- View usage statistics

---

## 🔐 Security Best Practices

1. **Never commit connection strings**
   - Keep in `.env` (already gitignored)
   - Use password manager for sharing

2. **Use different databases for dev/prod**
   - Development: `water-kiosk-dev`
   - Production: `water-kiosk-production`

3. **Rotate passwords periodically**
   - Neon Dashboard → Connection Details → Reset Password

4. **Limit team access**
   - Only share with trusted team members
   - Use Neon's team features for access control

---

## 💰 Neon Pricing

### Free Tier (Perfect for Development)
- ✅ 0.5 GB storage
- ✅ Shared CPU
- ✅ Auto-pause after inactivity
- ✅ Automatic backups (7-day retention)
- ✅ Unlimited projects

### Paid Tiers (For Production)
- More storage
- Dedicated CPU
- Always-on (no auto-pause)
- Longer backup retention
- Better performance

**For this project:** Free tier is perfect for development and small production deployments.

---

## 🆘 Troubleshooting

### Database Connection Error

**Symptoms:**
- `Error: P1001: Can't reach database server`
- Connection timeout

**Solutions:**
1. Check Neon dashboard - database might be paused
2. Click "Resume" or "Wake up"
3. Wait 10-20 seconds
4. Verify connection string in `.env` is correct
5. Ensure connection string includes `?sslmode=require`

### "Database not found" Error

**Solutions:**
1. Verify database name in connection string
2. Check Neon dashboard - project exists
3. Try resetting password in Neon dashboard

### Slow Queries

**Solutions:**
1. Free tier uses shared CPU - some slowness is normal
2. Check Neon dashboard for active connections
3. Consider upgrading to paid tier for production

### Migration Errors

**Solutions:**
1. Check migration status: `npx prisma migrate status`
2. Ensure database is active (not paused)
3. Verify connection string is correct
4. Try: `npm run prisma:generate` then `npm run prisma:migrate`

---

## 📊 Monitoring

### View Database Usage

1. Go to Neon Dashboard
2. Click your project
3. See storage usage, connection count, etc.

### Query Performance

1. Use Neon Dashboard → Logs
2. View query execution times
3. Identify slow queries

### Backup Management

- Free tier: 7-day automatic backups
- View backups in Neon Dashboard
- Restore from backup if needed

---

## 🔄 Switching Between Databases

### From Local Docker to Neon

1. Create Neon database
2. Update `.env` with Neon connection string
3. Run migrations: `npm run prisma:migrate`
4. Seed data: `npm run prisma:seed`

### From Neon to Local Docker

1. Update `.env` with local connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/water_kiosk?schema=public"
   ```
2. Start Docker: `docker-compose up -d postgres`
3. Run migrations: `npm run prisma:migrate`

---

## ✅ Checklist

- [ ] Neon account created
- [ ] Project created
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] Dependencies installed
- [ ] Migrations run
- [ ] Database seeded
- [ ] Server running
- [ ] Health check passing

---

## 📚 Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon Dashboard](https://console.neon.tech)
- [Prisma + Neon Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-neon)

---

**You're all set with Neon!** 🎉

