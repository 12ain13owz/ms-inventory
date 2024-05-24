import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('inventory:create', (inventory) => {
    socket.broadcast.emit('inventory:create', inventory);
  });

  socket.on('inventory:update', (id, inventory) => {
    socket.broadcast.emit('inventory:update', id, inventory);
  });
};
