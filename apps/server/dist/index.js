"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app_controller_1 = require("./controllers/app-controller");
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const PRODUCTION_URLS = [
    'https://your-app-name.vercel.app',
    'https://your-custom-domain.com',
    CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001'
];
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: PRODUCTION_URLS,
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express_1.default.json());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: PRODUCTION_URLS,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});
const appController = new app_controller_1.AppController(app, io);
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`🚀 Chat server running on port ${PORT}`);
        console.log(`📡 WebSocket server ready for connections`);
        console.log(`🌐 Accepting connections from: ${CLIENT_URL}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        console.log(`📈 Stats endpoint: http://localhost:${PORT}/api/stats`);
    });
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
exports.default = app;
//# sourceMappingURL=index.js.map