import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { LocationService } from '../services/location/location.service';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class SocketLocationService {
  socketIO: Socket;

  constructor(private locationService: LocationService) {}

  initializeSocketIO(socketIO: Socket) {
    this.socketIO = socketIO;
    if (!this.socketIO) return;

    this.socketIO.on('location:create', (item: Location) => {
      this.locationService.create(item);
    });

    this.socketIO.on('location:update', (id: number, item: Location) => {
      this.locationService.update(id, item);
    });

    this.socketIO.on('location:delete', (id: number) => {
      this.locationService.delete(id);
    });
  }

  create(item: Location): void {
    if (!this.socketIO) return;
    this.socketIO.emit('location:create', item);
  }

  update(id: number, item: Partial<Location>): void {
    if (!this.socketIO) return;
    this.socketIO.emit('location:update', id, item);
  }

  delete(id: number): void {
    if (!this.socketIO) return;
    this.socketIO.emit('location:delete', id);
  }
}
