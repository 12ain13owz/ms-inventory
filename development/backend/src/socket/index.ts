import { Server, Socket } from 'socket.io';
import log from '../utils/logger';
import inventorySocket from './inventory.socket';
import logSocket from './log.socket';
import categorySocket from './category.socket';
import statusSocket from './status.socket';
import fundSocket from './fund.socket';
import locationSocket from './location.socket';

let count = 0;
export default (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    count = io.engine.clientsCount;
    log.info('User connected');
    log.info('User count: ' + count);

    inventorySocket(io, socket);
    logSocket(io, socket);
    categorySocket(io, socket);
    statusSocket(io, socket);
    fundSocket(io, socket);
    locationSocket(io, socket);

    socket.on('disconnect', () => {
      count--;
      log.warn('User disconnected ' + count);
    });
  });
};
