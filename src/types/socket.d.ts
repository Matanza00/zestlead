// types/socket.d.ts

import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import type { Server as IOServer } from 'socket.io';
import type { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};
