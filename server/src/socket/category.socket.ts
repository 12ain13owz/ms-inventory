import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('category:create', (item) => {
    socket.broadcast.emit('category:create', item);
  });

  socket.on('category:update', (id, item) => {
    socket.broadcast.emit('category:update', id, item);
  });

  socket.on('category:delete', (id) => {
    socket.broadcast.emit('category:delete', id);
  });
};
