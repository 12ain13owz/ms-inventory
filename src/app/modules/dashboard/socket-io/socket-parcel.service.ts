import { Injectable } from '@angular/core';
import { SocketIoService } from './socket-io.service';
import { ParcelService } from '../services/parcel/parcel.service';
import { Socket } from 'socket.io-client';
import { Parcel } from '../models/parcel.model';

@Injectable({
  providedIn: 'root',
})
export class SocketParcelService {
  socketIO: Socket;

  constructor(
    private socketIoService: SocketIoService,
    private parcelService: ParcelService
  ) {
    this.socketIO = this.socketIoService.socketListener;
    if (!this.socketIO) return;

    this.socketIO.on('parcel:create', (parcel: Parcel) => {
      this.parcelService.createParcel(parcel);
    });

    this.socketIO.on('parcel:update', (id: number, parcel: Parcel) => {
      this.parcelService.updateParcel(id, parcel);
    });

    this.socketIO.on(
      'parcel:modifyQuantity',
      (id: number, quantity: number) => {
        this.parcelService.modifyQuantityParcel(id, quantity);
      }
    );

    this.socketIO.on('parcel:print', (id: number, print: boolean) => {
      this.parcelService.updatePrintParcel(id, print);
    });
  }

  createParcel(parcel: Parcel): void {
    if (!this.socketIO) return;
    this.socketIO.emit('parcel:create', parcel);
  }

  updateParcel(id: number, parcel: Parcel): void {
    if (!this.socketIO) return;
    this.socketIO.emit('parcel:update', id, parcel);
  }

  modifyQuantityParcel(id: number, quantity: number): void {
    if (!this.socketIO) return;
    this.socketIO.emit('parcel:modifyQuantity', id, quantity);
  }

  updatePrintParcel(id: number, print: boolean): void {
    if (!this.socketIO) return;
    this.socketIO.emit('parcel:print', id, print);
  }
}
