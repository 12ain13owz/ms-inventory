import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment.development';
import { SocketParcelService } from './socket-parcel.service';
import { SocketLogService } from './socket-log.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private url: string = environment.localhost;
  private socketIO: Socket;

  constructor(
    private socketParcelService: SocketParcelService,
    private socketLogService: SocketLogService
  ) {}

  setupSocketConnection() {
    this.socketIO = io(this.url, {
      reconnection: false,
    });
    if (!this.socketIO) return;

    this.socketParcelService.initializeSocketIO(this.socketIO);
    this.socketLogService.initializeSocketIO(this.socketIO);
  }

  get socketListener(): Socket {
    if (this.socketIO) return this.socketIO;
    return null;
  }
}
