"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHandler = void 0;
class ChatHandler {
    constructor(io, roomService) {
        this.io = io;
        this.roomService = roomService;
    }
    handleConnection(socket) {
        console.log(`User connected: ${socket.id}`);
        socket.on('join-room', ({ user, roomId }) => {
            try {
                this.handleJoinRoom(socket, user, roomId);
            }
            catch (error) {
                console.error('Error handling join-room:', error);
                socket.emit('error', 'Failed to join room');
            }
        });
        socket.on('leave-room', ({ roomId }) => {
            try {
                this.handleLeaveRoom(socket, roomId);
            }
            catch (error) {
                console.error('Error handling leave-room:', error);
                socket.emit('error', 'Failed to leave room');
            }
        });
        socket.on('send-message', (messageData) => {
            try {
                this.handleSendMessage(socket, messageData);
            }
            catch (error) {
                console.error('Error handling send-message:', error);
                socket.emit('error', 'Failed to send message');
            }
        });
        socket.on('disconnect', () => {
            try {
                this.handleDisconnect(socket);
            }
            catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    }
    handleJoinRoom(socket, userData, roomId) {
        const user = {
            ...userData,
            socketId: socket.id,
        };
        socket.join(roomId);
        const room = this.roomService.addUserToRoom(roomId, user);
        socket.emit('room-joined', {
            room: {
                id: room.id,
                name: room.name,
                createdAt: room.createdAt,
            },
            messages: room.messages,
            participants: room.participants,
        });
        socket.to(roomId).emit('user-joined', {
            user,
            participants: room.participants,
        });
        console.log(`User ${user.username} joined room ${roomId}`);
    }
    handleLeaveRoom(socket, roomId) {
        const userId = this.getUserIdFromSocket(socket);
        if (!userId)
            return;
        const result = this.roomService.removeUserFromRoom(roomId, userId);
        if (result.room && result.user) {
            socket.leave(roomId);
            socket.to(roomId).emit('user-left', {
                user: result.user,
                participants: result.room.participants,
            });
        }
    }
    handleSendMessage(socket, messageData) {
        console.log('Received message data:', messageData);
        const { content, username, roomId } = messageData;
        if (!content?.trim() || !username || !roomId) {
            console.log('Invalid message data - content:', content, 'username:', username, 'roomId:', roomId);
            socket.emit('error', 'Invalid message data');
            return;
        }
        const room = this.roomService.getRoom(roomId);
        if (!room) {
            socket.emit('error', 'Room not found');
            return;
        }
        const userInRoom = room.participants.some(p => p.socketId === socket.id);
        if (!userInRoom) {
            socket.emit('error', 'You are not in this room');
            return;
        }
        const message = this.roomService.addMessageToRoom(roomId, {
            username,
            content: content.trim(),
            timestamp: new Date(),
            roomId,
        });
        if (message) {
            console.log('Broadcasting message to room:', roomId, message);
            this.io.to(roomId).emit('message', message);
            console.log('Message sent successfully');
        }
        else {
            console.error('Failed to add message to room');
        }
    }
    handleDisconnect(socket) {
        console.log(`User disconnected: ${socket.id}`);
        const roomsLeft = this.roomService.removeUserBySocket(socket.id);
        roomsLeft.forEach(({ room, user }) => {
            socket.to(room.id).emit('user-left', {
                user,
                participants: room.participants,
            });
        });
    }
    getUserIdFromSocket(socket) {
        return socket.handshake.auth?.userId || socket.id;
    }
}
exports.ChatHandler = ChatHandler;
//# sourceMappingURL=chat-handler.js.map