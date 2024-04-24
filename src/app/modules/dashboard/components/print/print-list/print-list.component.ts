import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PrintService } from '../../../services/print/print.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ParcelPrint } from '../../../models/parcel.model';

@Component({
  selector: 'app-print-list',
  templateUrl: './print-list.component.html',
  styleUrl: './print-list.component.scss',
})
export class PrintListComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private printService = inject(PrintService);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  imageUrl: string = environment.imageUrl;
  isLoading: boolean = false;

  displayedColumns: string[] = [
    'image',
    'track',
    'quantity',
    'printCount',
    'action',
  ];
  dataSource = new MatTableDataSource<ParcelPrint>([]);

  ngOnInit(): void {
    this.dataSource.data = this.printService.getParcels();
    this.subscription = this.printService
      .onParcelsListener()
      .subscribe((parcels) => (this.dataSource.data = parcels));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onReset() {
    this.printService.resetParcel();
  }

  onBlurPrintCount(event: Event, id: number): void {
    const parcel = this.printService.getParcelById(id);
    if (!parcel) return;

    const el = event.target as HTMLInputElement;
    el.value = el.value.replace(/[^0-9]/g, '');
    if (+el.value <= 0) el.value = '1';
    if (+el.value >= parcel.printCount) el.value = parcel.quantity.toString();
    this.printService.updatPrintCountParcel(id, +el.value);
  }

  incrementPrintCount(id: number): void {
    this.printService.incrementPrintCount(id);
  }

  decrementPrintCount(id: number): void {
    this.printService.decrementPrintCount(id);
  }

  onDeleteParcel(id: number): void {
    this.printService.deleteParcle(id);
  }
}
