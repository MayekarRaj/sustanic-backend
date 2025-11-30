import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { prisma } from './config/database';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import dispenseRoutes from './routes/dispense.routes';
import configRoutes from './routes/config.routes';
import healthRoutes from './routes/health.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/dispense', dispenseRoutes);
app.use('/config', configRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Water Kiosk API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      user: '/user',
      dispense: '/dispense',
      config: '/config',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Keep database alive (prevent Neon auto-pause on free tier)
// Ping database every 4 minutes to keep it active
if (config.nodeEnv === 'development') {
  const keepAliveInterval = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log(`💚 Database keep-alive ping - ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('❌ Database keep-alive failed:', error);
    }
  }, 4 * 60 * 1000); // Every 4 minutes (240 seconds)

  // Initial ping on startup
  prisma.$queryRaw`SELECT 1`.catch(() => {
    // Ignore initial connection errors (database might be waking up)
  });

  // Cleanup on process exit
  process.on('SIGINT', () => {
    clearInterval(keepAliveInterval);
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    clearInterval(keepAliveInterval);
    process.exit(0);
  });
}

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  if (config.nodeEnv === 'development') {
    console.log(`💚 Database keep-alive: Active (pings every 4 minutes)`);
  }
});

export default app;

