import { Server, Socket } from 'socket.io';
import { RoomService } from '../services/room-service';
import { User } from '../types';

/**
 * ChatHandler manages all WebSocket events for the chat functionality
 */
export class ChatHandler {
  private roomService: RoomService;

  constructor(private io: Server, roomService: RoomService) {
    this.roomService = roomService;
  }

  /**
   * Initialize socket event handlers for a new connection
   */
  handleConnection(socket: Socket): void {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a room
    socket.on('join-room', ({ user, roomId }) => {
      try {
        this.handleJoinRoom(socket, user, roomId);
      } catch (error) {
        console.error('Error handling join-room:', error);
        socket.emit('error', 'Failed to join room');
      }
    });

    // Handle user leaving a room
    socket.on('leave-room', ({ roomId }) => {
      try {
        this.handleLeaveRoom(socket, roomId);
      } catch (error) {
        console.error('Error handling leave-room:', error);
        socket.emit('error', 'Failed to leave room');
      }
    });

    // Handle sending messages
    socket.on('send-message', (messageData) => {
      try {
        this.handleSendMessage(socket, messageData);
      } catch (error) {
        console.error('Error handling send-message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        this.handleDisconnect(socket);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  }

  /**
   * Handle user joining a room
   */
  private handleJoinRoom(socket: Socket, userData: Omit<User, 'socketId'>, roomId: string): void {
    const user: User = {
      ...userData,
      socketId: socket.id,
    };

    // Join the socket room
    socket.join(roomId);

    // Add user to the room
    const room = this.roomService.addUserToRoom(roomId, user);

    // Send room data to the joining user
    socket.emit('room-joined', {
      room: {
        id: room.id,
        name: room.name,
        createdAt: room.createdAt,
      },
      messages: room.messages,
      participants: room.participants,
    });

    // Notify other users in the room
    socket.to(roomId).emit('user-joined', {
      user,
      participants: room.participants,
    });

    console.log(`User ${user.username} joined room ${roomId}`);
  }

  /**
   * Handle user leaving a room
   */
  private handleLeaveRoom(socket: Socket, roomId: string): void {
    const userId = this.getUserIdFromSocket(socket);
    if (!userId) return;

    const result = this.roomService.removeUserFromRoom(roomId, userId);
    
    if (result.room && result.user) {
      // Leave the socket room
      socket.leave(roomId);

      // Notify other users in the room
      socket.to(roomId).emit('user-left', {
        user: result.user,
        participants: result.room.participants,
      });
    }
  }

  /**
   * Handle sending a message
   */
  private handleSendMessage(socket: Socket, messageData: any): void {
    console.log('Received message data:', messageData);
    const { content, username, roomId } = messageData;

    if (!content?.trim() || !username || !roomId) {
      console.log('Invalid message data - content:', content, 'username:', username, 'roomId:', roomId);
      socket.emit('error', 'Invalid message data');
      return;
    }

    // Validate that the user is in the room
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

    // Add message to room
    const message = this.roomService.addMessageToRoom(roomId, {
      username,
      content: content.trim(),
      timestamp: new Date(),
      roomId,
    });

    if (message) {
      // Broadcast message to all users in the room
      console.log('Broadcasting message to room:', roomId, message);
      this.io.to(roomId).emit('message', message);
      console.log('Message sent successfully');
    } else {
      console.error('Failed to add message to room');
    }
  }

  /**
   * Handle user disconnection
   */
  private handleDisconnect(socket: Socket): void {
    console.log(`User disconnected: ${socket.id}`);

    // Remove user from all rooms
    const roomsLeft = this.roomService.removeUserBySocket(socket.id);

    // Notify other users in each room the user left
    roomsLeft.forEach(({ room, user }) => {
      socket.to(room.id).emit('user-left', {
        user,
        participants: room.participants,
      });
    });
  }

  /**
   * Extract user ID from socket (this is a simplified approach)
   * In production, you might want to store user sessions more securely
   */
  private getUserIdFromSocket(socket: Socket): string | null {
    // This is a simplified approach - in production you might store user data differently
    return socket.handshake.auth?.userId || socket.id;
  }
}