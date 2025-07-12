"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const uuid_1 = require("uuid");
class RoomService {
    constructor() {
        this.rooms = new Map();
    }
    getOrCreateRoom(roomId) {
        let room = this.rooms.get(roomId);
        if (!room) {
            room = {
                id: roomId,
                name: `Room ${roomId}`,
                participants: [],
                messages: [],
                createdAt: new Date(),
            };
            this.rooms.set(roomId, room);
            console.log(`Created new room: ${roomId}`);
        }
        return room;
    }
    addUserToRoom(roomId, user) {
        const room = this.getOrCreateRoom(roomId);
        const existingUser = room.participants.find(p => p.id === user.id);
        if (existingUser) {
            existingUser.socketId = user.socketId;
        }
        else {
            room.participants.push(user);
        }
        console.log(`User ${user.username} joined room ${roomId}`);
        return room;
    }
    removeUserFromRoom(roomId, userId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return { room: null, user: null };
        }
        const userIndex = room.participants.findIndex(p => p.id === userId);
        if (userIndex === -1) {
            return { room: null, user: null };
        }
        const user = room.participants[userIndex];
        room.participants.splice(userIndex, 1);
        if (room.participants.length === 0) {
            console.log(`Room ${roomId} is now empty`);
        }
        console.log(`User ${user.username} left room ${roomId}`);
        return { room, user };
    }
    removeUserBySocket(socketId) {
        const results = [];
        for (const room of this.rooms.values()) {
            const userIndex = room.participants.findIndex(p => p.socketId === socketId);
            if (userIndex !== -1) {
                const user = room.participants[userIndex];
                room.participants.splice(userIndex, 1);
                results.push({ room, user });
                console.log(`User ${user.username} disconnected from room ${room.id}`);
            }
        }
        return results;
    }
    addMessageToRoom(roomId, messageData) {
        const room = this.rooms.get(roomId);
        if (!room) {
            console.error(`Attempted to add message to non-existent room: ${roomId}`);
            return null;
        }
        const message = {
            id: (0, uuid_1.v4)(),
            ...messageData,
        };
        room.messages.push(message);
        if (room.messages.length > 100) {
            room.messages = room.messages.slice(-100);
        }
        console.log(`Message added to room ${roomId} by ${message.username}`);
        return message;
    }
    getRoom(roomId) {
        return this.rooms.get(roomId) || null;
    }
    getAllRooms() {
        return Array.from(this.rooms.values());
    }
    getRoomStats() {
        let totalUsers = 0;
        let totalMessages = 0;
        for (const room of this.rooms.values()) {
            totalUsers += room.participants.length;
            totalMessages += room.messages.length;
        }
        return {
            totalRooms: this.rooms.size,
            totalUsers,
            totalMessages,
        };
    }
}
exports.RoomService = RoomService;
//# sourceMappingURL=room-service.js.map