import { Injectable } from '@angular/core';
import { InventoryService } from '../services/inventory/inventory.service';
import { Socket } from 'socket.io-client';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class SocketInventoryService {
  socketIO: Socket;

  constructor(private inventoryService: InventoryService) {}

  initializeSocketIO(socketIO: Socket) {
    this.socketIO = socketIO;
    if (!this.socketIO) return;

    this.socketIO.on('inventory:create', (item: Inventory) => {
      this.inventoryService.create(item);
    });

    this.socketIO.on('inventory:update', (id: number, item: Inventory) => {
      this.inventoryService.update(id, item);
    });
  }

  create(item: Inventory): void {
    if (!this.socketIO) return;
    this.socketIO.emit('inventory:create', item);
  }

  update(id: number, item: Partial<Inventory>): void {
    if (!this.socketIO) return;
    this.socketIO.emit('inventory:update', id, item);
  }
}
