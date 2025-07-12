"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const room_service_1 = require("../services/room-service");
const chat_handler_1 = require("../sockets/chat-handler");
const health_1 = require("../routes/health");
const stats_1 = require("../routes/stats");
class AppController {
    constructor(app, io) {
        this.app = app;
        this.io = io;
        this.roomService = new room_service_1.RoomService();
        this.chatHandler = new chat_handler_1.ChatHandler(io, this.roomService);
        this.setupRoutes();
        this.setupSocketHandlers();
    }
    setupRoutes() {
        this.app.use('/api', health_1.healthRouter);
        this.app.use('/api', (0, stats_1.createStatsRouter)(this.roomService));
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
    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            this.chatHandler.handleConnection(socket);
        });
        setInterval(() => {
            const stats = this.roomService.getRoomStats();
            const connectedSockets = this.io.engine.clientsCount;
            console.log(`Stats - Rooms: ${stats.totalRooms}, Users: ${stats.totalUsers}, Messages: ${stats.totalMessages}, Connections: ${connectedSockets}`);
        }, 30000);
    }
    getRoomService() {
        return this.roomService;
    }
}
exports.AppController = AppController;
//# sourceMappingURL=app-controller.js.map