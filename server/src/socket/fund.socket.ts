import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('fund:create', (item) => {
    socket.broadcast.emit('fund:create', item);
  });

  socket.on('fund:update', (id, item) => {
    socket.broadcast.emit('fund:update', id, item);
  });

  socket.on('fund:delete', (id) => {
    socket.broadcast.emit('fund:delete', id);
  });
};
