import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('log:create', (log) => {
    socket.broadcast.emit('log:create', log);
  });
};
