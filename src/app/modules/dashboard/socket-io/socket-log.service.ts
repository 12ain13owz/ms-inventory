import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketIoService } from './socket-io.service';
import { LogService } from '../services/log/log.service';
import { Log } from '../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class SocketLogService {
  socketIO: Socket;

  constructor(
    private socketIoService: SocketIoService,
    private logService: LogService
  ) {
    this.socketIO = this.socketIoService.socketListener;
    if (!this.socketIO) return;

    this.socketIO.on('log:create', (log: Log) => {
      this.logService.createLog(log);
    });
  }

  createLog(log: Log): void {
    if (!this.socketIO) return;
    this.socketIO.emit('log:create', log);
  }
}
