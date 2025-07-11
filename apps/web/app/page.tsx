'use client';

import { useChat } from '@/hooks/useChat';
import { HeroSection } from '@/components/landing/hero-section';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  const {
    currentUser,
    currentRoom,
    messages,
    participants,
    isConnected,
    joinRoom,
    sendMessage,
    leaveRoom,
  } = useChat();

  // Show chat interface if user has joined a room
  if (currentUser && currentRoom) {
    return (
      <ChatInterface
        currentUser={currentUser}
        roomId={currentRoom.id}
        messages={messages}
        participants={participants}
        onSendMessage={sendMessage}
        onLeaveRoom={leaveRoom}
        isConnected={isConnected}
      />
    );
  }

  // Show landing page for initial user experience
  return <HeroSection onJoinRoom={joinRoom} />;
}