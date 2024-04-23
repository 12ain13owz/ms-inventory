import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { LogService } from '../services/log/log.service';
import { Log } from '../models/log.model';

@Injectable({
  providedIn: 'root',
})
export class SocketLogService {
  socketIO: Socket;

  constructor(private logService: LogService) {}

  initializeSocketIO(socketIO: Socket) {
    this.socketIO = socketIO;
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
