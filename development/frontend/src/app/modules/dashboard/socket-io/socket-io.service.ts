import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { SocketInventoryService } from './socket-inventory.service';
import { SocketLogService } from './socket-log.service';
import { SocketCategoryService } from './socket-category.service';
import { SocketStatusService } from './socket-status.service';
import { SocketFundService } from './socket-fund.service';
import { SocketLocationService } from './socket-location.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private url: string = environment.localhost;
  private socketIO: Socket;

  constructor(
    private socketInventoryService: SocketInventoryService,
    private socketLogService: SocketLogService,
    private socketCategoryService: SocketCategoryService,
    private socketStatusService: SocketStatusService,
    private socketFundService: SocketFundService,
    private socketLocationService: SocketLocationService
  ) {}

  setupSocketConnection() {
    this.socketIO = io(this.url, {
      reconnection: false,
    });
    if (!this.socketIO) return;

    this.socketInventoryService.initializeSocketIO(this.socketIO);
    this.socketLogService.initializeSocketIO(this.socketIO);
    this.socketCategoryService.initializeSocketIO(this.socketIO);
    this.socketStatusService.initializeSocketIO(this.socketIO);
    this.socketFundService.initializeSocketIO(this.socketIO);
    this.socketLocationService.initializeSocketIO(this.socketIO);
  }

  disconnect() {
    if (!this.socketIO) return;
    this.socketIO.close();
  }
}
