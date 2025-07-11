import { Router, Request, Response } from 'express';
import { RoomService } from '../services/room-service';

export const createStatsRouter = (roomService: RoomService) => {
  const router = Router();

  /**
   * Get server statistics
   */
  router.get('/stats', (req: Request, res: Response) => {
    const stats = roomService.getRoomStats();
    
    res.json({
      ...stats,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  /**
   * Get all rooms (for debugging - remove in production)
   */
  router.get('/rooms', (req: Request, res: Response) => {
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