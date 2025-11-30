# Neon Dashboard Navigation Guide

Complete guide to navigating and using the Neon dashboard for your Water Kiosk project.

## 🚀 Accessing Your Dashboard

1. Go to [console.neon.tech](https://console.neon.tech)
2. Log in with your account
3. You'll see your projects listed

---

## 📊 Main Dashboard Sections

### 1. **Projects Overview**

When you log in, you'll see:
- **Project List**: All your Neon projects
- **Project Name**: `water-kiosk` (your project)
- **Region**: `ap-southeast-1` (Asia Pacific - Singapore)
- **Status**: Active/Ready

**What you can do:**
- Click on project name to open it
- See storage usage
- View active connections
- Check project status

---

## 🗂️ Project Dashboard

Once you click on your `water-kiosk` project, you'll see:

### **Left Sidebar Navigation:**

#### 📋 **Dashboard Tab**
- **Overview**: Project stats, storage, connections
- **Usage**: CPU time, storage, data transfer
- **Activity**: Recent activity logs

#### 🌿 **Branches Tab**
- **Production Branch**: `br-damp-art-a1q997gg`
- **Development Branch**: `br-ancient-mud-a1p9cx61`
- **Branch Details**: Size, status, creation date

**What you can do:**
- Switch between branches
- Create new branches
- View branch details
- Delete branches (be careful!)

#### 💾 **Databases Tab**
- Lists all databases in the project
- Default: `neondb`
- Shows size and status

#### 🔌 **Connection Details Tab** ⭐ **IMPORTANT**
- **Connection String**: Your database connection URL
- **Host**: Database endpoint
- **Database Name**: `neondb`
- **User**: `neondb_owner`
- **Password**: (hidden, can reset)

**What you can do:**
- Copy connection string
- Reset password
- View connection parameters
- See connection pooling options

#### 📝 **SQL Editor Tab** ⭐ **VERY USEFUL**
- Write and run SQL queries directly
- View query results
- Execute migrations manually
- Debug database issues

**Example queries:**
```sql
-- View all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- View all users
SELECT * FROM users;

-- View wallet balances
SELECT u.name, w.balance 
FROM users u 
JOIN wallets w ON u.id = w.user_id;
```

#### 📊 **Logs Tab**
- Query execution logs
- Connection logs
- Error logs
- Performance metrics

#### ⚙️ **Settings Tab**
- Project name
- Region
- PostgreSQL version
- Auto-suspend settings
- Maintenance window
- Security settings

---

## 🔍 Common Tasks

### **View Your Database Tables**

1. Go to **SQL Editor** tab
2. Run this query:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
3. You'll see all your tables:
   - `users`
   - `wallets`
   - `transactions`
   - `dispense_requests`
   - `water_quality_logs`
   - `auth_sessions`

### **View Data in Tables**

1. Go to **SQL Editor** tab
2. Run queries like:
   ```sql
   -- View all users
   SELECT * FROM users;
   
   -- View wallets
   SELECT * FROM wallets;
   
   -- View recent transactions
   SELECT * FROM transactions 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

### **Get Connection String**

1. Go to **Connection Details** tab
2. Find **Connection string** section
3. Click **Copy** button
4. Use it in your `.env` file

### **Reset Database Password**

1. Go to **Connection Details** tab
2. Click **Reset Password**
3. Copy new password
4. Update your `.env` file

### **Check Database Status**

1. Go to **Dashboard** tab
2. Check **Status** section:
   - **Active**: Database is running
   - **Paused**: Database is sleeping (free tier)
   - **Resume**: Click to wake up paused database

### **View Storage Usage**

1. Go to **Dashboard** tab
2. See **Storage** section:
   - Current usage
   - Limit (0.5 GB on free tier)
   - Percentage used

### **View Query Logs**

1. Go to **Logs** tab
2. See recent queries
3. Check execution times
4. Debug slow queries

---

## 🌿 Working with Branches

### **Switch Between Branches**

1. Go to **Branches** tab
2. Click on branch name (e.g., `development`)
3. Get connection string for that branch
4. Update `.env` with branch-specific connection string

### **Create New Branch**

1. Go to **Branches** tab
2. Click **Create Branch**
3. Choose parent branch
4. Name your branch
5. Click **Create**

**Use cases:**
- Feature branches for testing
- Staging environment
- Production backup

---

## 🔐 Security Features

### **Connection String Security**

- **Never share** connection strings publicly
- Use environment variables (`.env` file)
- Reset password if compromised
- Use different passwords for dev/prod

### **IP Allowlist** (Paid tiers)

- Restrict connections by IP
- Add allowed IP addresses
- Block unauthorized access

---

## 📈 Monitoring

### **View Activity**

1. Go to **Dashboard** → **Activity**
2. See recent operations:
   - Database connections
   - Query executions
   - Branch operations

### **View Usage Stats**

1. Go to **Dashboard** → **Usage**
2. See:
   - CPU time used
   - Storage used
   - Data transfer
   - Connection time

---

## 🆘 Troubleshooting

### **Database is Paused**

**Symptoms:**
- Connection errors
- "Can't reach database server"

**Solution:**
1. Go to **Dashboard** tab
2. Click **Resume** or **Wake up**
3. Wait 10-20 seconds
4. Try connecting again

### **Connection String Not Working**

**Solution:**
1. Go to **Connection Details** tab
2. Copy fresh connection string
3. Verify it includes `?sslmode=require`
4. Update `.env` file
5. Restart your server

### **Can't See Tables**

**Solution:**
1. Go to **SQL Editor** tab
2. Run: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
3. If empty, run migrations: `npm run prisma:migrate`

### **View Error Logs**

1. Go to **Logs** tab
2. Filter by error level
3. Check recent errors
4. See error details and timestamps

---

## 💡 Pro Tips

1. **Bookmark SQL Editor**: Most useful feature for quick queries
2. **Use Branches**: Keep dev/prod separate
3. **Monitor Usage**: Check storage regularly on free tier
4. **Save Queries**: Neon SQL Editor lets you save favorite queries
5. **Check Logs**: Debug issues by viewing query logs

---

## 🎯 Quick Navigation Cheat Sheet

| What you want to do | Go to tab |
|---------------------|-----------|
| View/run SQL queries | **SQL Editor** |
| Get connection string | **Connection Details** |
| Check database status | **Dashboard** |
| View your data | **SQL Editor** → Run SELECT queries |
| See query logs | **Logs** |
| Switch branches | **Branches** |
| Check storage | **Dashboard** → Usage |
| Reset password | **Connection Details** → Reset Password |

---

## 🔗 Direct Links

- **Dashboard**: [console.neon.tech](https://console.neon.tech)
- **Your Project**: [console.neon.tech/projects](https://console.neon.tech/projects)
- **Documentation**: [neon.tech/docs](https://neon.tech/docs)

---

**You're all set to navigate Neon!** 🎉

