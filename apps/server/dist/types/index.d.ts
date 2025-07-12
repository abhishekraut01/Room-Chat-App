export interface User {
    id: string;
    username: string;
    socketId: string;
}
export interface Message {
    id: string;
    username: string;
    content: string;
    timestamp: Date;
    roomId: string;
}
export interface Room {
    id: string;
    name: string;
    participants: User[];
    messages: Message[];
    createdAt: Date;
}
export interface SocketEvents {
    'join-room': (data: {
        user: Omit<User, 'socketId'>;
        roomId: string;
    }) => void;
    'leave-room': (data: {
        roomId: string;
    }) => void;
    'send-message': (message: Omit<Message, 'id'>) => void;
    message: (message: Message) => void;
    'user-joined': (data: {
        user: User;
        participants: User[];
    }) => void;
    'user-left': (data: {
        user: User;
        participants: User[];
    }) => void;
    'room-joined': (data: {
        room: Room;
        messages: Message[];
        participants: User[];
    }) => void;
    error: (error: string) => void;
}
//# sourceMappingURL=index.d.ts.map