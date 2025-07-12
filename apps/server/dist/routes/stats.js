"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatsRouter = void 0;
const express_1 = require("express");
const createStatsRouter = (roomService) => {
    const router = (0, express_1.Router)();
    router.get('/stats', (req, res) => {
        const stats = roomService.getRoomStats();
        res.json({
            ...stats,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    router.get('/rooms', (req, res) => {
        const rooms = roomService.getAllRooms().map(room => ({
            id: room.id,
            name: room.name,
            participantCount: room.participants.length,
            messageCount: room.messages.length,
            createdAt: room.createdAt,
        }));
        res.json({ rooms });
    });
    return router;
};
exports.createStatsRouter = createStatsRouter;
//# sourceMappingURL=stats.js.map