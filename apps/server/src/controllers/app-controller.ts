import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { RoomService } from '../services/room-service';
import { ChatHandler } from '../sockets/chat-handler';
import { healthRouter } from '../routes/health';
import { createStatsRouter } from '../routes/stats';

/**
 * AppController orchestrates the entire application setup
 * It connects Express routes with Socket.IO handlers and services
 */
export class AppController {
  private roomService: RoomService;
  private chatHandler: ChatHandler;

  constructor(private app: Express, private io: SocketIOServer) {
    this.roomService = new RoomService();
    this.chatHandler = new ChatHandler(io, this.roomService);
    
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  /**
   * Setup Express routes
   */
  private setupRoutes(): void {
    // Health check route
    this.app.use('/api', healthRouter);
    
    // Stats routes (include room service)
    this.app.use('/api', createStatsRouter(this.roomService));

    // Basic info route
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Chat App Server',
        version: '1.0.0',
        description: 'Real-time chat application server',
        endpoints: {
          health: '/api/health',
          stats: '/api/stats',
          rooms: '/api/rooms',
        },
      });
    });
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      this.chatHandler.handleConnection(socket);
    });

    // Log connection stats periodically
    setInterval(() => {
      const stats = this.roomService.getRoomStats();
      const connectedSockets = this.io.engine.clientsCount;
      
      console.log(`Stats - Rooms: ${stats.totalRooms}, Users: ${stats.totalUsers}, Messages: ${stats.totalMessages}, Connections: ${connectedSockets}`);
    }, 30000); // Log every 30 seconds
  }

  /**
   * Get room service instance (for testing or external access)
   */
  getRoomService(): RoomService {
    return this.roomService;
  }
}