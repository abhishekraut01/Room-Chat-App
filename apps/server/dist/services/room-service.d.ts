import { Room, User, Message } from '../types';
export declare class RoomService {
    private rooms;
    getOrCreateRoom(roomId: string): Room;
    addUserToRoom(roomId: string, user: User): Room;
    removeUserFromRoom(roomId: string, userId: string): {
        room: Room | null;
        user: User | null;
    };
    removeUserBySocket(socketId: string): Array<{
        room: Room;
        user: User;
    }>;
    addMessageToRoom(roomId: string, messageData: Omit<Message, 'id'>): Message | null;
    getRoom(roomId: string): Room | null;
    getAllRooms(): Room[];
    getRoomStats(): {
        totalRooms: number;
        totalUsers: number;
        totalMessages: number;
    };
}
//# sourceMappingURL=room-service.d.ts.map