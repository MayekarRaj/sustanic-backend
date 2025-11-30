# How to View Your Database

Multiple ways to view and interact with your PostgreSQL database.

## 🎨 Option 1: Prisma Studio (Easiest - Visual Interface)

**Best for:** Browsing data, quick edits, visual interface

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Browse records
- Edit data
- Add new records
- Filter and search

**To stop:** Press `Ctrl+C` in the terminal

---

## 💻 Option 2: psql (Command Line)

**Best for:** SQL queries, advanced operations

### Connect via Docker:

```bash
docker-compose exec postgres psql -U user -d water_kiosk
```

### Common psql Commands:

```sql
-- List all tables
\dt

-- View table structure
\d users

-- View all users
SELECT * FROM users;

-- View wallets with balances
SELECT u.name, w.balance FROM users u JOIN wallets w ON u.id = w.user_id;

-- View recent transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;

-- Exit psql
\q
```

---

## 🖥️ Option 3: GUI Tools (Desktop Applications)

### DBeaver (Free, Cross-platform)
1. Download from [dbeaver.io](https://dbeaver.io)
2. Create new PostgreSQL connection:
   - Host: `localhost`
   - Port: `5432`
   - Database: `water_kiosk`
   - Username: `user`
   - Password: `password`

### pgAdmin (Free, Official PostgreSQL Tool)
1. Download from [pgadmin.org](https://www.pgadmin.org)
2. Add server with same credentials as above

### TablePlus (macOS/Windows, Paid but has free tier)
1. Download from [tableplus.com](https://tableplus.com)
2. Create PostgreSQL connection with same credentials

---

## 📊 Quick Database Queries

### View All Users
```bash
docker-compose exec postgres psql -U user -d water_kiosk -c "SELECT id, name, qr_code, phone FROM users;"
```

### View Wallet Balances
```bash
docker-compose exec postgres psql -U user -d water_kiosk -c "SELECT u.name, w.balance FROM users u JOIN wallets w ON u.id = w.user_id;"
```

### View Recent Transactions
```bash
docker-compose exec postgres psql -U user -d water_kiosk -c "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;"
```

### View Latest Water Quality
```bash
docker-compose exec postgres psql -U user -d water_kiosk -c "SELECT * FROM water_quality_logs ORDER BY created_at DESC LIMIT 1;"
```

### Count Records in Each Table
```bash
docker-compose exec postgres psql -U user -d water_kiosk -c "
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'wallets', COUNT(*) FROM wallets
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'dispense_requests', COUNT(*) FROM dispense_requests
UNION ALL
SELECT 'water_quality_logs', COUNT(*) FROM water_quality_logs;
"
```

---

## 🔍 Check Database Connection

```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database connection
docker-compose exec postgres pg_isready -U user

# List all databases
docker-compose exec postgres psql -U user -c "\l"
```

---

## 📝 Prisma Commands for Database

```bash
# View database schema
npx prisma db pull

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Open Prisma Studio
npm run prisma:studio

# Check migration status
npx prisma migrate status
```

---

## 🎯 Recommended Workflow

**For daily development:**
- Use **Prisma Studio** (`npm run prisma:studio`) - easiest and most visual

**For complex queries:**
- Use **psql** or a GUI tool like DBeaver

**For quick checks:**
- Use the command-line queries above

---

## 💡 Tips

1. **Prisma Studio** is the fastest way to see your data
2. Keep it running in a separate terminal while developing
3. Use **psql** for complex SQL operations
4. GUI tools are great for exploring relationships between tables

