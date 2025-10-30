// src/lib/socket.ts
import { getIO as internalGetIO } from '@/pages/api/socket';

export const getIO = () => internalGetIO();
