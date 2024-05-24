import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket): void => {
  socket.on('inventoryCheck:create', (inventoryCheck) => {
    socket.broadcast.emit('inventoryCheck:create', inventoryCheck);
  });
};
