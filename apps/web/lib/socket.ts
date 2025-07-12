import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Determine server URL based on environment
    const getServerUrl = () => {
      if (process.env.NEXT_PUBLIC_SERVER_URL) {
        return process.env.NEXT_PUBLIC_SERVER_URL;
      }
      
      // In production, use your deployed backend URL
      if (process.env.NODE_ENV === 'production') {
        return 'https://your-backend-url.railway.app'; // Replace with your actual backend URL
      }
      
      return 'http://localhost:3001';
    };
    
    socket = io(getServerUrl(), {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};