// /pages/api/socket.ts
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import type { NextApiResponseWithSocket } from '@/types/socket';

let io: SocketIOServer | null = null;

export function getIO() {
  return io;
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket?.server?.io) {
    console.log('🧠 Initializing new Socket.io server...');

    const httpServer = res.socket.server as NetServer;
    io = new SocketIOServer(httpServer);

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('🔌 New socket connection');

      socket.on('support-message', (msg) => {
        console.log('📩 Received support-message:', msg);
        io?.emit('support-message', msg);
      });
    });
  }

  res.end();
};

export default ioHandler;
