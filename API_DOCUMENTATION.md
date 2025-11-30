# Water Kiosk API Documentation

Complete API reference for the Water Kiosk Backend System.

## Base URL

```
Development: http://localhost:3000
Production: <your-render-url>
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check the health status of the API and database connection.

**No authentication required**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected"
}
```

**Error Response (503):**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "disconnected",
  "error": "Connection error message"
}
```

---

### 2. Scan Login

**POST** `/auth/scan-login`

Authenticate a user by scanning their QR code. Returns a JWT token for subsequent requests.

**No authentication required**

**Request Body:**
```json
{
  "scan_code": "QR_USER_001"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid QR code"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "path": "body.scan_code",
      "message": "QR code is required"
    }
  ]
}
```

---

### 3. Logout

**POST** `/auth/logout`

Invalidate the current session and logout the user.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

---

### 4. Get Dashboard

**GET** `/user/dashboard`

Get user dashboard data including wallet balance, latest water quality metrics, and allowed quantities.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
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

**Note:** If no water quality data exists, `water_quality` will be `null`.

**Error Response (401):**
```json
{
  "success": false,
  "error": "No token provided. Please include Authorization: Bearer <token>"
}
```

---

### 5. Get Wallet

**GET** `/user/wallet`

Get the current wallet balance for the authenticated user.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "balance": 500
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

---

### 6. Start Dispense

**POST** `/dispense/start`

Create a new dispense request. Validates wallet balance and quantity before creating the request.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 1000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "dispense_id": "550e8400-e29b-41d4-a716-446655440000",
  "quantity_ml": 1000,
  "cost": 100,
  "message": "Dispense request created. Please proceed with hardware dispensing.",
  "hardware_instruction": {
    "action": "start_dispense",
    "quantity_ml": 1000,
    "dispense_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Error Responses:**

Insufficient Balance (400):
```json
{
  "success": false,
  "error": "Insufficient balance. Required: 100, Available: 50"
}
```

Invalid Quantity (400):
```json
{
  "success": false,
  "error": "Invalid quantity. Allowed quantities: 500, 1000, 2000"
}
```

Validation Error (400):
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "path": "body.quantity",
      "message": "Quantity must be a positive integer"
    }
  ]
}
```

---

### 7. Complete Dispense

**POST** `/dispense/complete`

Complete a dispense request. If status is COMPLETED, deducts the amount from wallet and creates a transaction record.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "dispense_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED"
}
```

**Status Values:**
- `COMPLETED` - Dispense was successful, wallet will be deducted
- `FAILED` - Dispense failed, no wallet deduction

**Success Response (200):**
```json
{
  "success": true,
  "dispense_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED",
  "wallet_balance": 400,
  "amount_deducted": 100
}
```

**Error Responses:**

Not Found (404):
```json
{
  "success": false,
  "error": "Dispense request not found"
}
```

Unauthorized (403):
```json
{
  "success": false,
  "error": "Unauthorized access to this dispense request"
}
```

Invalid Status (400):
```json
{
  "success": false,
  "error": "Invalid status. Must be one of: COMPLETED, FAILED"
}
```

Validation Error (400):
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "path": "body.dispense_id",
      "message": "Invalid dispense ID format"
    }
  ]
}
```

---

### 8. Check Allowed Quantity

**GET** `/dispense/is-allowed-to-dispense?quantity=1000`

Check if a specific quantity is allowed for dispensing.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `quantity` (required, integer) - Quantity in milliliters

**Success Response (200):**
```json
{
  "success": true,
  "allowed": true
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid quantity parameter"
}
```

---

### 9. Get Quantities

**GET** `/config/quantities`

Get the list of allowed quantities for dispensing.

**Authentication required**

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "quantities": [500, 1000, 2000]
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message"
}
```

For validation errors, additional details are provided:

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "path": "field.path",
      "message": "Error message"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (unauthorized access)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error
- `503` - Service Unavailable (database connection issues)

## Rate Limiting

Currently not implemented in Phase 1. Consider adding rate limiting for production.

## Cost Calculation

The cost is calculated as:
- **Cost per 100ml**: 10 currency units
- **Total Cost**: `Math.ceil((quantity_ml / 100) * 10)`

Example:
- 500ml = 50 units
- 1000ml = 100 units
- 2000ml = 200 units

This can be adjusted in `src/services/dispense.service.ts`.

## Sample QR Codes

The seed script creates users with these QR codes:
- `QR_USER_001`
- `QR_USER_002`
- `QR_USER_003`
- `QR_USER_004`
- `QR_USER_005`

Use any of these for testing the scan-login endpoint.

