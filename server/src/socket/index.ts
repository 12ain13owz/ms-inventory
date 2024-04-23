import { Server, Socket } from 'socket.io';
import log from '../utils/logger';
import connectSocket from './connect.socket';
import parcelSocket from './parcel.socket';
import logSocket from './log.socket';

export default (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    log.info(`Socket connected: ${socket.id}`);

    connectSocket(io, socket);
    parcelSocket(io, socket);
    logSocket(io, socket);
  });
};
