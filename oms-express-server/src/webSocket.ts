import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export default function setupSocket(http: Server): SocketIOServer {
  const io = new SocketIOServer(http, {
    cors: {
      origin: '*', 
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
      console.log(': A user disconnected');
    });
  });

  return io;
}
