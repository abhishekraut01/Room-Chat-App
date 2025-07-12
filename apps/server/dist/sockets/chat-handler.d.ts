import { Server, Socket } from 'socket.io';
import { RoomService } from '../services/room-service';
export declare class ChatHandler {
    private io;
    private roomService;
    constructor(io: Server, roomService: RoomService);
    handleConnection(socket: Socket): void;
    private handleJoinRoom;
    private handleLeaveRoom;
    private handleSendMessage;
    private handleDisconnect;
    private getUserIdFromSocket;
}
//# sourceMappingURL=chat-handler.d.ts.map