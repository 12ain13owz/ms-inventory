import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('inventory:create', (item) => {
    socket.broadcast.emit('inventory:create', item);
  });

  socket.on('inventory:update', (id, item) => {
    socket.broadcast.emit('inventory:update', id, item);
  });
};
