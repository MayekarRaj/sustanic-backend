# Water Kiosk Backend API

A complete backend system for a Water Kiosk / Water ATM application built with Node.js, Express, TypeScript, and PostgreSQL.

## 🏗️ Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Error Handling**: Custom middleware

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod validation schemas
│   └── server.ts        # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding script
├── .env.example         # Environment variables template
├── docker-compose.yml    # Docker setup for local development
├── Dockerfile           # Production Docker image
└── package.json        # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- Neon account (free) - [Sign up here](https://neon.tech)
- npm or yarn

**No local database setup needed!** We use Neon cloud database.

### 🎯 Setup with Neon (Recommended)

1. **Create Neon Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Set up environment**

```bash
cp env.example .env
```

Edit `.env` and paste your Neon connection string:
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

3. **Install dependencies and set up database**

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. **Start development server**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

See [QUICK_START.md](./QUICK_START.md) for detailed step-by-step instructions.

For comprehensive Neon setup guide, see [NEON_SETUP.md](./NEON_SETUP.md).

### 💡 Why Neon?

- ✅ No local setup required
- ✅ Free tier perfect for development
- ✅ Automatic backups
- ✅ Accessible from anywhere
- ✅ Production-ready
- ✅ Easy team collaboration

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Health Check

**GET** `/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

---

#### Authentication

**POST** `/auth/scan-login`

Authenticate user using QR code.

**Request:**
```json
{
  "scan_code": "QR_USER_001"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**POST** `/auth/logout`

Logout user and invalidate session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### User

**GET** `/user/dashboard`

Get user dashboard data (wallet balance, water quality, allowed quantities).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "wallet_balance": 500,
  "water_quality": {
    "ph": 7.2,
    "tds": 150,
    "turbidity": 0.5
  },
  "allowed_quantities": [500, 1000, 2000]
}
```

**GET** `/user/wallet`

Get current wallet balance.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "balance": 500
}
```

---

#### Dispense

**POST** `/dispense/start`

Start a water dispense request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "quantity": 1000
}
```

**Response:**
```json
{
  "success": true,
  "dispense_id": "uuid",
  "quantity_ml": 1000,
  "cost": 100,
  "message": "Dispense request created. Please proceed with hardware dispensing.",
  "hardware_instruction": {
    "action": "start_dispense",
    "quantity_ml": 1000,
    "dispense_id": "uuid"
  }
}
```

**POST** `/dispense/complete`

Complete a dispense request and deduct from wallet.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "dispense_id": "uuid",
  "status": "COMPLETED"
}
```

**Response:**
```json
{
  "success": true,
  "dispense_id": "uuid",
  "status": "COMPLETED",
  "wallet_balance": 400,
  "amount_deducted": 100
}
```

**GET** `/dispense/is-allowed-to-dispense?quantity=1000`

Check if a quantity is allowed for dispensing.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `quantity` (required): Quantity in ml

**Response:**
```json
{
  "success": true,
  "allowed": true
}
```

---

#### Config

**GET** `/config/quantities`

Get list of allowed quantities.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "quantities": [500, 1000, 2000]
}
```

---

## 🗄️ Database Schema

### Users
- `id` (UUID)
- `qr_code` (String, unique)
- `name` (String)
- `phone` (String, nullable)
- `created_at` (DateTime)

### Auth Sessions
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `jwt_token` (String)
- `expires_at` (DateTime)
- `created_at` (DateTime)

### Wallets
- `id` (UUID)
- `user_id` (UUID, unique, foreign key)
- `balance` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Water Quality Logs
- `id` (UUID)
- `ph` (Float)
- `tds` (Float)
- `turbidity` (Float)
- `created_at` (DateTime)

### Dispense Requests
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `quantity_ml` (Integer)
- `status` (Enum: PENDING, DISPENSING, COMPLETED, FAILED)
- `created_at` (DateTime)
- `completed_at` (DateTime, nullable)

### Transactions
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `amount` (Integer, negative for dispense)
- `description` (String)
- `created_at` (DateTime)

## 🌱 Seeding Data

The seed script creates:
- 5 sample users with QR codes (QR_USER_001 to QR_USER_005)
- Wallets with random initial balances
- Sample water quality logs

Run seeding:
```bash
npm run prisma:seed
```

## 🚢 Deployment

**For team deployment with Docker (local) + Neon + Render, see the complete guide:**
👉 **[TEAM_DEPLOYMENT.md](./TEAM_DEPLOYMENT.md)** - Complete team workflow and production deployment

### Quick Deploy to Render

1. **Create PostgreSQL Database on Neon**
   - Sign up at [Neon](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Deploy Backend to Render**
   - Sign up at [Render](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build && npx prisma generate`
   - Set start command: `npm start`
   - Add environment variables:
     ```
     DATABASE_URL=<your-neon-connection-string>
     JWT_SECRET=<your-secret-key>
     NODE_ENV=production
     PORT=3000
     ALLOWED_QUANTITIES=500,1000,2000
     MIN_WALLET_BALANCE=0
     JWT_EXPIRES_IN=7d
     ```

3. **Run Migrations**
   - After deployment, run migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed Database (Optional)**
   ```bash
   npm run prisma:seed
   ```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<neon-connection-string>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
ALLOWED_QUANTITIES=500,1000,2000
MIN_WALLET_BALANCE=0
```

## 🧪 Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/auth/scan-login \
  -H "Content-Type: application/json" \
  -d '{"scan_code": "QR_USER_001"}'

# Get dashboard (replace TOKEN with actual token)
curl http://localhost:3000/user/dashboard \
  -H "Authorization: Bearer TOKEN"
```

## 📝 Notes

- **Cost Calculation**: Currently set to 10 currency units per 100ml. Adjust in `src/services/dispense.service.ts`
- **QR Codes**: Sample QR codes are `QR_USER_001` through `QR_USER_005`
- **JWT Expiry**: Default is 7 days, configurable via `JWT_EXPIRES_IN`
- **Allowed Quantities**: Configurable via `ALLOWED_QUANTITIES` environment variable

## 🔒 Security Considerations

- Change `JWT_SECRET` in production
- Use strong database passwords
- Enable HTTPS in production
- Consider rate limiting for production
- Validate all inputs (already implemented with Zod)

## 🛠️ Development Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:seed      # Seed database with sample data
```

## 📄 License

ISC

## 🤝 Contributing

This is Phase 1 of the project. Future improvements may include:
- Rate limiting
- Request logging
- Advanced analytics
- WebSocket support for real-time updates
- Admin dashboard APIs
- Payment gateway integration

