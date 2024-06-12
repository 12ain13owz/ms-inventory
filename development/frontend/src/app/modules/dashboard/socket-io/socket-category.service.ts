import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class SocketCategoryService {
  socketIO: Socket;

  constructor(private categotyService: CategoryService) {}

  initializeSocketIO(socketIO: Socket) {
    this.socketIO = socketIO;
    if (!this.socketIO) return;

    this.socketIO.on('category:create', (item: Category) => {
      this.categotyService.create(item);
    });

    this.socketIO.on('category:update', (id: number, item: Category) => {
      this.categotyService.update(id, item);
    });

    this.socketIO.on('category:delete', (id: number) => {
      this.categotyService.delete(id);
    });
  }

  create(item: Category): void {
    if (!this.socketIO) return;
    this.socketIO.emit('category:create', item);
  }

  update(id: number, item: Partial<Category>): void {
    if (!this.socketIO) return;
    this.socketIO.emit('category:update', id, item);
  }

  delete(id: number): void {
    if (!this.socketIO) return;
    this.socketIO.emit('category:delete', id);
  }
}
