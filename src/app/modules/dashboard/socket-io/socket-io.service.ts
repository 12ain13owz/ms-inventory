import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { SocketInventoryService } from './socket-inventory.service';
import { SocketLogService } from './socket-log.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private url: string = environment.localhost;
  private socketIO: Socket;

  constructor(
    private socketInventoryService: SocketInventoryService,
    private socketLogService: SocketLogService
  ) {}

  setupSocketConnection() {
    this.socketIO = io(this.url, {
      reconnection: false,
    });
    if (!this.socketIO) return;

    this.socketInventoryService.initializeSocketIO(this.socketIO);
    this.socketLogService.initializeSocketIO(this.socketIO);
  }

  disconnect() {
    if (!this.socketIO) return;
    this.socketIO.close();
  }
}
