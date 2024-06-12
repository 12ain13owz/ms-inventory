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
import { InventoryPrint } from '../../../models/inventory.model';

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

  title: string = 'รายการ พิมพ์ครุภัณฑ์';
  imageUrl: string = environment.imageUrl;
  isLoading: boolean = false;
  print: string = '1';

  displayedColumns: string[] = [
    'image',
    'code',
    'description',
    'printCount',
    'action',
  ];
  dataSource = new MatTableDataSource<InventoryPrint>([]);

  ngOnInit(): void {
    this.dataSource.data = this.printService.getAll();
    this.subscription = this.printService
      .onListener()
      .subscribe((inventories) => (this.dataSource.data = inventories));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onReset() {
    this.printService.reset();
  }

  onBlurPrintCount(event: Event, id: number): void {
    const inventory = this.printService.getById(id);
    if (!inventory) return;

    const el = event.target as HTMLInputElement;
    el.value = el.value.replace(/[^0-9]/g, '');
    if (+el.value <= 0) el.value = '1';
    if (+el.value >= 100) el.value = '100';
    this.printService.updateCount(id, +el.value);
  }

  incrementPrintCount(id: number): void {
    this.printService.incrementCount(id);
  }

  decrementPrintCount(id: number): void {
    this.printService.decrementCount(id);
  }

  onDeleteInventory(id: number): void {
    this.printService.delete(id);
  }
}
