import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private url: string = environment.localhost;
  private socketIO: Socket;

  constructor() {}

  setupSocketConnection() {
    this.socketIO = io(this.url, {
      reconnection: false,
    });

    if (!this.socketIO) return;
  }

  get socketListener(): Socket {
    if (this.socketIO) return this.socketIO;
    return null;
  }
}
