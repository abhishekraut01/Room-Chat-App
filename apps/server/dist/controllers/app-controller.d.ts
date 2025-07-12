import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { RoomService } from '../services/room-service';
export declare class AppController {
    private app;
    private io;
    private roomService;
    private chatHandler;
    constructor(app: Express, io: SocketIOServer);
    private setupRoutes;
    private setupSocketHandlers;
    getRoomService(): RoomService;
}
//# sourceMappingURL=app-controller.d.ts.map