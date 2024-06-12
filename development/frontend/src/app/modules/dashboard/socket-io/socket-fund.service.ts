import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { FundService } from '../services/fund/fund.service';
import { Fund } from '../models/fund.model';

@Injectable({
  providedIn: 'root',
})
export class SocketFundService {
  socketIO: Socket;

  constructor(private fundService: FundService) {}

  initializeSocketIO(socketIO: Socket) {
    this.socketIO = socketIO;
    if (!this.socketIO) return;

    this.socketIO.on('fund:create', (item: Fund) => {
      this.fundService.create(item);
    });

    this.socketIO.on('fund:update', (id: number, item: Fund) => {
      this.fundService.update(id, item);
    });

    this.socketIO.on('fund:delete', (id: number) => {
      this.fundService.delete(id);
    });
  }

  create(item: Fund): void {
    if (!this.socketIO) return;
    this.socketIO.emit('fund:create', item);
  }

  update(id: number, item: Partial<Fund>): void {
    if (!this.socketIO) return;
    this.socketIO.emit('fund:update', id, item);
  }

  delete(id: number): void {
    if (!this.socketIO) return;
    this.socketIO.emit('fund:delete', id);
  }
}
