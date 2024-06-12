import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { StatusService } from '../services/status/status.service';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root',
})
export class SocketStatusService {
  socketIO: Socket;

  constructor(private statusService: StatusService) {}

  initializeSocketIO(socketIO: Socket) {
    this.socketIO = socketIO;
    if (!this.socketIO) return;

    this.socketIO.on('status:create', (item: Status) => {
      this.statusService.create(item);
    });

    this.socketIO.on('status:update', (id: number, item: Status) => {
      this.statusService.update(id, item);
    });

    this.socketIO.on('status:delete', (id: number) => {
      this.statusService.delete(id);
    });
  }

  create(item: Status): void {
    if (!this.socketIO) return;
    this.socketIO.emit('status:create', item);
  }

  update(id: number, item: Partial<Status>): void {
    if (!this.socketIO) return;
    this.socketIO.emit('status:update', id, item);
  }

  delete(id: number): void {
    if (!this.socketIO) return;
    this.socketIO.emit('status:delete', id);
  }
}
