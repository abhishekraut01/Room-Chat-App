export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  roomId: string;
}

export interface User {
  id: string;
  username: string;
}

export interface Room {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
  createdAt: Date;
}

export interface ChatState {
  currentUser: User | null;
  currentRoom: Room | null;
  messages: Message[];
  participants: User[];
  isConnected: boolean;
}
