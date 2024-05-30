import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('log:create', (item) => {
    socket.broadcast.emit('log:create', item);
  });
};
