# Quick Start Guide

Get the Water Kiosk Backend running in 5 minutes!

## Prerequisites

- Node.js 20+ installed
- Neon account (free) - [Sign up here](https://neon.tech)

**No local database setup needed!** We'll use Neon cloud database.

## 🚀 Setup with Neon (Recommended)

### Step 1: Create Neon Database

1. **Sign up at [neon.tech](https://neon.tech)**
   - Free tier includes 0.5GB storage
   - No credit card required

2. **Create a new project**
   - Click "Create Project"
   - Choose a project name (e.g., "water-kiosk")
   - Select a region closest to you
   - Click "Create Project"

3. **Get your connection string**
   - After project creation, you'll see a connection string
   - It looks like: `postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - **Copy this connection string** - you'll need it in the next step

### Step 2: Set up Environment

```bash
# Copy environment template
cp env.example .env
```

Edit `.env` and paste your Neon connection string:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Step 3: Install Dependencies & Set up Database

```bash
# Install npm packages
npm install

# Generate Prisma Client
npm run prisma:generate

# Create database tables (migrations)
npm run prisma:migrate

# Seed with sample data (optional but recommended)
npm run prisma:seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

Your server will be running at `http://localhost:3000` 🎉

---

## ✅ Verify Setup

1. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Test Login**
   ```bash
   curl -X POST http://localhost:3000/auth/scan-login \
     -H "Content-Type: application/json" \
     -d '{"scan_code": "QR_USER_001"}'
   ```

3. **View Database**
   ```bash
   npm run prisma:studio
   # Opens at http://localhost:5555
   ```

---

## 📝 Sample QR Codes

The seed script creates these test users:
- `QR_USER_001` - John Doe
- `QR_USER_002` - Jane Smith
- `QR_USER_003` - Bob Johnson
- `QR_USER_004` - Alice Williams
- `QR_USER_005` - Charlie Brown

---

## 🔄 Daily Workflow

```bash
# Start development server
npm run dev

# View database (in separate terminal)
npm run prisma:studio
```

---

## 🆘 Troubleshooting

**Database connection error?**
- Verify `DATABASE_URL` in `.env` is correct
- Check Neon dashboard to ensure database is active (not paused)
- Make sure connection string includes `?sslmode=require`

**Neon database paused?**
- Free tier databases pause after inactivity
- Go to Neon dashboard and click "Resume" or "Wake up"

**Migration errors?**
- Run `npm run prisma:generate` first
- Check connection string format
- Verify database is active in Neon dashboard

**Port already in use?**
- Change `PORT` in `.env` to a different port (e.g., 3001)

---

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- See [TEAM_DEPLOYMENT.md](./TEAM_DEPLOYMENT.md) for team workflow
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

---

## 💡 Why Neon?

- ✅ **No local setup** - Works immediately
- ✅ **Free tier** - Perfect for development
- ✅ **Automatic backups** - Your data is safe
- ✅ **Accessible anywhere** - Work from any device
- ✅ **Production-ready** - Same database for dev and prod
- ✅ **Easy sharing** - Team members can use the same database

---

## 🔄 Alternative: Local Development (Optional)

If you prefer local development with Docker:

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Update .env to use local connection
DATABASE_URL="postgresql://user:password@localhost:5432/water_kiosk?schema=public"

# Continue with Step 3 above
```

See [docker-compose.yml](./docker-compose.yml) for Docker setup details.
