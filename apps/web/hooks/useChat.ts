'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { Message, User, ChatState } from '@/types/chat';
import { toast } from 'sonner';

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    currentUser: null,
    currentRoom: null,
    messages: [],
    participants: [],
    isConnected: false,
  });

  const socket = getSocket();

  useEffect(() => {
    // Initialize connection state
    setChatState(prev => ({ ...prev, isConnected: socket.connected }));
    
    // Socket event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setChatState(prev => ({ ...prev, isConnected: true }));
      toast.success('Connected to chat server');
    });

    socket.on('disconnect', () => {
      setChatState(prev => ({ ...prev, isConnected: false }));
      toast.error('Disconnected from chat server');
    });

    socket.on('message', (message: Message) => {
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    });

    socket.on('user-joined', ({ user, participants }: { user: User; participants: User[] }) => {
      setChatState(prev => ({
        ...prev,
        participants,
      }));
      toast.success(`${user.username} joined the room`);
    });

    socket.on('user-left', ({ user, participants }: { user: User; participants: User[] }) => {
      setChatState(prev => ({
        ...prev,
        participants,
      }));
      toast.info(`${user.username} left the room`);
    });

    socket.on('room-joined', ({ room, messages, participants }) => {
      setChatState(prev => ({
        ...prev,
        currentRoom: room,
        messages,
        participants,
      }));
    });

    socket.on('error', (error: string) => {
      toast.error(error);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('room-joined');
      socket.off('error');
    };
  }, [socket]);

  const joinRoom = useCallback((username: string, roomId: string) => {
    const user: User = {
      id: socket.id || Math.random().toString(36).substring(7),
      username,
    };

    setChatState(prev => ({ ...prev, currentUser: user }));
    socket.emit('join-room', { user, roomId });
  }, [socket]);

  const sendMessage = useCallback((content: string) => {
    console.log('sendMessage called with:', content);
    console.log('Current user:', chatState.currentUser);
    console.log('Current room:', chatState.currentRoom);
    console.log('Socket connected:', socket.connected);
    
    if (!chatState.currentUser || !chatState.currentRoom) {
      console.error('Missing user or room');
      toast.error('Please join a room first');
      return;
    }

    if (!content.trim()) {
      console.error('Empty message');
      toast.error('Message cannot be empty');
      return;
    }

    // Check if socket is connected, if not, try to send anyway (socket.io handles reconnection)
    if (!socket.connected) {
      console.warn('Socket not connected, attempting to send anyway');
      toast.warning('Connection unstable, message may be delayed');
    }

    const message: Omit<Message, 'id'> = {
      username: chatState.currentUser.username,
      content: content.trim(),
      timestamp: new Date(),
      roomId: chatState.currentRoom.id,
    };

    console.log('Sending message:', message);
    socket.emit('send-message', message);
    
    // Add a timeout to check if message was sent
    setTimeout(() => {
      console.log('Message sent, waiting for server response...');
    }, 100);
  }, [socket, chatState.currentUser, chatState.currentRoom]);

  const leaveRoom = useCallback(() => {
    if (chatState.currentRoom) {
      socket.emit('leave-room', { roomId: chatState.currentRoom.id });
      setChatState({
        currentUser: null,
        currentRoom: null,
        messages: [],
        participants: [],
        isConnected: chatState.isConnected,
      });
    }
  }, [socket, chatState.currentRoom, chatState.isConnected]);

  const disconnect = useCallback(() => {
    disconnectSocket();
    setChatState({
      currentUser: null,
      currentRoom: null,
      messages: [],
      participants: [],
      isConnected: false,
    });
  }, []);

  return {
    ...chatState,
    joinRoom,
    sendMessage,
    leaveRoom,
    disconnect,
  };
};