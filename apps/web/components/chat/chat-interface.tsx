'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, LogOut, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatTime } from '@/lib/utils';
import { Message, User } from '@/types/chat';

interface ChatInterfaceProps {
  currentUser: User;
  roomId: string;
  messages: Message[];
  participants: User[];
  onSendMessage: (content: string) => void;
  onLeaveRoom: () => void;
  isConnected: boolean;
}

export const ChatInterface = ({
  currentUser,
  roomId,
  messages,
  participants,
  onSendMessage,
  onLeaveRoom,
  isConnected,
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      console.log('Message is empty, not sending');
      return;
    }
    
    if (!isConnected) {
      console.log('Not connected to server, cannot send message');
      return;
    }
    
    console.log('Sending message:', newMessage.trim());
    onSendMessage(newMessage.trim());
    setNewMessage('');
    
    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto h-screen flex gap-4">
        {/* Main Chat Area */}
        <Card className="flex-1 bg-white/10 backdrop-blur-md border-white/20 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="bg-white/10 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Room {roomId}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={onLeaveRoom}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-red-500/20 hover:border-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave
              </Button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <AnimatePresence>
                {messages.map((message, index) => {
                  const isCurrentUser = message.username === currentUser.username;
                  const showAvatar = index === 0 || messages[index - 1].username !== message.username;
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && showAvatar && (
                        <Avatar className="w-8 h-8 bg-white/20">
                          <AvatarFallback className="bg-white/30 text-white text-xs">
                            {getInitials(message.username)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {!isCurrentUser && !showAvatar && (
                        <div className="w-8 h-8" />
                      )}

                      <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-first' : ''}`}>
                        {showAvatar && (
                          <div className={`text-sm text-white/80 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {message.username}
                          </div>
                        )}
                        
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isCurrentUser
                              ? 'bg-purple-600 text-white ml-auto'
                              : 'bg-white/20 text-white backdrop-blur-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-purple-200' : 'text-white/60'}`}>
                            {formatTime(new Date(message.timestamp))}
                          </p>
                        </div>
                      </div>

                      {isCurrentUser && showAvatar && (
                        <Avatar className="w-8 h-8 bg-purple-600">
                          <AvatarFallback className="bg-purple-700 text-white text-xs">
                            {getInitials(message.username)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          {/* Message Input */}
          <div className="p-4 bg-white/10 border-t border-white/20">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isConnected ? "Type your message..." : "Connecting..."}
                  className="w-full h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 focus:ring-2 focus:ring-purple-400/50 resize-none"
                  maxLength={500}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`h-12 px-4 ${isConnected ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-500 hover:bg-orange-600'} disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[48px]`}
                title={isConnected ? 'Send message' : 'Connecting to server...'}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-2 text-xs text-white/50 flex justify-between">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{newMessage.length}/500</span>
            </div>
          </div>
        </Card>

        {/* Participants Sidebar */}
        <Card className="w-64 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="bg-white/10 border-b border-white/20">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participants
              <Badge variant="secondary" className="bg-white/20 text-white">
                {participants.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-3">
              {participants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/10"
                >
                  <Avatar className="w-8 h-8 bg-white/20">
                    <AvatarFallback className="bg-white/30 text-white text-xs">
                      {getInitials(participant.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {participant.username}
                      {participant.id === currentUser.id && (
                        <span className="text-xs text-white/60 ml-1">(You)</span>
                      )}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};