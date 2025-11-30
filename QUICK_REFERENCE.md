# Quick Reference Card

One-page cheat sheet for common tasks.

## 🚀 Local Development

```bash
# Setup (first time)
# 1. Create Neon database at https://neon.tech
# 2. Copy connection string
cp env.example .env
# 3. Paste Neon connection string in .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Daily workflow
npm run dev

# View database
npm run prisma:studio
```

## 🔄 Database Migrations

```bash
# Create migration (after schema change)
npm run prisma:migrate

# Apply migrations (after git pull)
npm run prisma:migrate

# Production (in Render Shell)
npx prisma migrate deploy
```

## 🌐 Production Deployment

### First Time Setup
1. Create Neon database → Get connection string
2. Deploy to Render → Set environment variables
3. Run migrations: `npx prisma migrate deploy` (in Render Shell)

### Regular Deployments
- Push to `main` branch → Render auto-deploys
- Run migrations in Render Shell if schema changed

## 🔍 Common Commands

```bash
# Health check
curl http://localhost:3000/health

# Test login
curl -X POST http://localhost:3000/auth/scan-login \
  -H "Content-Type: application/json" \
  -d '{"scan_code": "QR_USER_001"}'

# View database (local)
npm run prisma:studio

# View database
npm run prisma:studio

# Reset database (WARNING: deletes all data)
# Use Neon dashboard SQL editor or Prisma Studio to drop tables
# Then run:
npm run prisma:migrate
npm run prisma:seed
```

## 📝 Environment Variables

**Local (.env):**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Production (Render):**
```env
DATABASE_URL="postgresql://user:password@neon-host/neondb?sslmode=require"
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check Neon dashboard - database might be paused |
| Neon paused | Wake up database in Neon dashboard |
| Migration conflicts | Coordinate with team, check migration status |
| Production connection error | Check DATABASE_URL in Render |
| Connection string invalid | Ensure it includes `?sslmode=require` |

## 📚 Full Documentation

- [TEAM_DEPLOYMENT.md](./TEAM_DEPLOYMENT.md) - Complete team guide
- [QUICK_START.md](./QUICK_START.md) - Setup instructions
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Environment config

