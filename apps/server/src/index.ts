import express, { Express } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { AppController } from './controllers/app-controller';

// Configuration
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Production URLs (add your actual deployed URLs)
const PRODUCTION_URLS = [
  'https://your-app-name.vercel.app',
  'https://your-custom-domain.com',
  CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001'
];

// Create Express app
const app: Express = express();
const server = createServer(app);

// Configure CORS
app.use(cors({
  origin: PRODUCTION_URLS,
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Create Socket.IO server with CORS configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: PRODUCTION_URLS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Initialize application controller
const appController = new AppController(app, io);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server only in non-Vercel environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 Chat server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready for connections`);
    console.log(`🌐 Accepting connections from: ${CLIENT_URL}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📈 Stats endpoint: http://localhost:${PORT}/api/stats`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

// Export for Vercel
export default app;
