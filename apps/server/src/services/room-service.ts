import { v4 as uuidv4 } from 'uuid';
import { Room, User, Message } from '../types';

/**
 * RoomService handles all room-related operations
 * This includes creating rooms, managing participants, and storing messages
 */
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  /**
   * Get or create a room with the given ID
   */
  getOrCreateRoom(roomId: string): Room {
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

  /**
   * Add a user to a room
   */
  addUserToRoom(roomId: string, user: User): Room {
    const room = this.getOrCreateRoom(roomId);
    
    // Check if user is already in the room
    const existingUser = room.participants.find(p => p.id === user.id);
    if (existingUser) {
      // Update socket ID if user reconnects
      existingUser.socketId = user.socketId;
    } else {
      room.participants.push(user);
    }
    
    console.log(`User ${user.username} joined room ${roomId}`);
    return room;
  }

  /**
   * Remove a user from a room
   */
  removeUserFromRoom(roomId: string, userId: string): { room: Room | null; user: User | null } {
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

    // Clean up empty rooms (keep them for a while to preserve chat history)
    if (room.participants.length === 0) {
      // We could implement room cleanup logic here
      console.log(`Room ${roomId} is now empty`);
    }

    console.log(`User ${user.username} left room ${roomId}`);
    return { room, user };
  }

  /**
   * Remove user from all rooms by socket ID
   */
  removeUserBySocket(socketId: string): Array<{ room: Room; user: User }> {
    const results: Array<{ room: Room; user: User }> = [];

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

  /**
   * Add a message to a room
   */
  addMessageToRoom(roomId: string, messageData: Omit<Message, 'id'>): Message | null {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      console.error(`Attempted to add message to non-existent room: ${roomId}`);
      return null;
    }

    const message: Message = {
      id: uuidv4(),
      ...messageData,
    };

    room.messages.push(message);

    // Keep only the last 100 messages per room to prevent memory issues
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }

    console.log(`Message added to room ${roomId} by ${message.username}`);
    return message;
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  /**
   * Get all rooms (for debugging/admin purposes)
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Get room statistics
   */
  getRoomStats(): { totalRooms: number; totalUsers: number; totalMessages: number } {
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