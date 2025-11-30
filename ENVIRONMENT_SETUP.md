# Environment Setup Guide

Quick reference for managing different environments.

## Environment Files

### Local Development (Neon)
**File:** `.env` (gitignored)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
ALLOWED_QUANTITIES=500,1000,2000
MIN_WALLET_BALANCE=0
```

**Database:** Neon PostgreSQL (cloud)

---

### Production (Render + Neon)
**Location:** Render Dashboard → Environment Variables

```env
NODE_ENV=production
PORT=10000
DATABASE_URL="postgresql://user:password@neon-host/neondb?sslmode=require"
JWT_SECRET=<strong-random-32-char-secret>
JWT_EXPIRES_IN=7d
ALLOWED_QUANTITIES=500,1000,2000
MIN_WALLET_BALANCE=0
```

**Database:** Neon PostgreSQL (cloud)

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Staging (Optional)
**Location:** Render Dashboard → Staging Service → Environment Variables

Same as production but with:
- Different Neon database
- Different JWT_SECRET
- `NODE_ENV=staging` (optional)

---

## Switching Between Environments

### Local → Production Testing

1. **Temporarily update `.env`:**
   ```env
   DATABASE_URL="your-neon-connection-string"
   ```

2. **Test connection:**
   ```bash
   npx prisma db pull
   ```

3. **Revert to local:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/water_kiosk?schema=public"
   ```

### Production → Local Development

1. **Pull production data** (if needed):
   ```bash
   # Export from Neon (use Neon dashboard SQL editor or pg_dump)
   # Or use Prisma Studio to view/export data
   ```

---

## Environment-Specific Commands

### Local Development
```bash
# Run migrations
npm run prisma:migrate

# Seed data
npm run prisma:seed

# Start server
npm run dev

# View database
npm run prisma:studio
```

### Production (Render Shell)
```bash
# Deploy migrations (use deploy, not dev)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Seed (if needed)
npm run prisma:seed
```

---

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Production secrets are in Render (not in code)
- [ ] Different JWT_SECRET for production
- [ ] Strong database passwords
- [ ] SSL enabled for production database (`sslmode=require`)
- [ ] Environment variables reviewed before deployment

---

## Quick Reference

| Environment | Database | Where to Set |
|------------|----------|--------------|
| Local | Neon PostgreSQL | `.env` file |
| Production | Neon PostgreSQL | Render Dashboard |
| Staging | Neon PostgreSQL (separate) | Render Dashboard |

