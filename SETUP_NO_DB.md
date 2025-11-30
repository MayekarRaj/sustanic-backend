# Setup Guide: No Local PostgreSQL Required

Don't have PostgreSQL installed? No problem! Here are the easiest ways to get started.

## 🎯 Recommended: Docker (5 minutes)

**Best for:** Local development, testing, learning

### What You Need
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Node.js 20+

### Steps

1. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d postgres
   ```
   This downloads and starts PostgreSQL automatically. Wait 10-15 seconds.

2. **Set up the project**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Install dependencies
   npm install
   
   # Generate Prisma Client
   npm run prisma:generate
   
   # Create database tables
   npm run prisma:migrate
   
   # Add sample data
   npm run prisma:seed
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

That's it! Your database is running in Docker and your backend is ready.

**To stop PostgreSQL later:**
```bash
docker-compose down
```

**To start it again:**
```bash
docker-compose up -d postgres
```

---

## ☁️ Alternative: Cloud Database (No Docker)

**Best for:** Production-like testing, no local setup

### Option A: Neon (Recommended - Free Tier)

1. **Sign up at [neon.tech](https://neon.tech)**
   - Free tier includes 0.5GB storage
   - No credit card required

2. **Create a project**
   - Click "Create Project"
   - Choose a name (e.g., "water-kiosk")
   - Select a region

3. **Get connection string**
   - After creation, you'll see a connection string like:
     ```
     postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```

4. **Set up project**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Edit .env and paste your Neon connection string:
   # DATABASE_URL="your-neon-connection-string"
   
   # Install and set up
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run dev
   ```

### Option B: Supabase (Free Tier)

1. **Sign up at [supabase.com](https://supabase.com)**
2. **Create a new project**
3. **Get connection string**
   - Go to Settings → Database
   - Copy "Connection string" → "URI"
4. **Update `.env` and run setup** (same as Neon above)

### Option C: Railway (Free Tier)

1. **Sign up at [railway.app](https://railway.app)**
2. **Create PostgreSQL database**
3. **Copy connection string**
4. **Update `.env` and run setup**

---

## 🔄 Switching Between Options

### From Docker to Cloud
1. Stop Docker: `docker-compose down`
2. Update `.env` with cloud connection string
3. Run migrations: `npm run prisma:migrate`

### From Cloud to Docker
1. Update `.env` with Docker connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/water_kiosk?schema=public"
   ```
2. Start Docker: `docker-compose up -d postgres`
3. Run migrations: `npm run prisma:migrate`

---

## ✅ Verify Your Setup

After setup, test your connection:

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"healthy","timestamp":"...","database":"connected"}
```

---

## 🆘 Still Having Issues?

**Docker Issues:**
- Make sure Docker Desktop is running
- Check: `docker ps` (should show postgres container)
- Restart: `docker-compose restart postgres`

**Connection Issues:**
- Verify `.env` file exists and has correct `DATABASE_URL`
- Check connection string format (should start with `postgresql://`)
- For cloud: Make sure database is not paused (Neon pauses after inactivity)

**Need Help?**
- Check [README.md](./README.md) for detailed docs
- Check [QUICK_START.md](./QUICK_START.md) for step-by-step guide

