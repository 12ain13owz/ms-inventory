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

    this.socketIO.on('inventory:create', (inventory: Inventory) => {
      this.inventoryService.createInventory(inventory);
    });

    this.socketIO.on('inventory:update', (id: number, inventory: Inventory) => {
      this.inventoryService.updateInventory(id, inventory);
    });
  }

  createInventory(inventory: Inventory): void {
    if (!this.socketIO) return;
    this.socketIO.emit('inventory:create', inventory);
  }

  updateInventory(id: number, inventory: Inventory): void {
    if (!this.socketIO) return;
    this.socketIO.emit('inventory:update', id, inventory);
  }
}