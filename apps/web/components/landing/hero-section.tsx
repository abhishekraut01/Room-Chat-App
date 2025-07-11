'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/moving-border';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRoomId } from '@/lib/utils';

interface HeroSectionProps {
  onJoinRoom: (username: string, roomId: string) => void;
}

export const HeroSection = ({ onJoinRoom }: HeroSectionProps) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    if (!username.trim()) return;
    const newRoomId = generateRoomId();
    onJoinRoom(username.trim(), newRoomId);
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) return;
    onJoinRoom(username.trim(), roomId.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Connect & Chat
            <span className="block text-white/80">Instantly</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join real-time conversations with friends, colleagues, or meet new people 
            in our beautifully designed chat rooms.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { icon: Zap, label: 'Instant Messaging' },
              { icon: Users, label: 'Group Chats' },
              { icon: MessageCircle, label: 'Real-time Updates' },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <Icon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Get Started</CardTitle>
              <CardDescription className="text-white/80">
                Enter your details to join or create a chat room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-medium">
                  Your Name
                </Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId" className="text-white font-medium">
                  Room ID (Optional)
                </Label>
                <Input
                  id="roomId"
                  placeholder="Enter room ID to join existing room"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                  maxLength={6}
                />
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleJoinRoom}
                  disabled={!username.trim() || !roomId.trim()}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  borderRadius="0.75rem"
                >
                  Join Room
                </Button>

                <div className="text-center">
                  <span className="text-white/60 text-sm">or</span>
                </div>

                <Button
                  onClick={handleCreateRoom}
                  disabled={!username.trim()}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  borderRadius="0.75rem"
                >
                  Create New Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};