import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('status:create', (item) => {
    socket.broadcast.emit('status:create', item);
  });

  socket.on('status:update', (id, item) => {
    console.log(item);
    socket.broadcast.emit('status:update', id, item);
  });

  socket.on('status:delete', (id) => {
    socket.broadcast.emit('status:delete', id);
  });
};
