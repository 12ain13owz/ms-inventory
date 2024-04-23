import { Server, Socket } from 'socket.io';
import log from '../utils/logger';

export default (io: Server, socket: Socket): void => {
  log.info('User connected');
  socket.on('disconnect', () => console.log('user disconnected'));

  const count = io.engine.clientsCount;
  log.info('User count: ' + count);
};
