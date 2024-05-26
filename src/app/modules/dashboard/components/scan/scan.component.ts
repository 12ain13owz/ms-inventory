import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  Observable,
  Subscription,
  catchError,
  concatMap,
  defer,
  filter,
  finalize,
  from,
  interval,
  of,
  take,
  tap,
  timer,
} from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ScanService } from '../../services/scan/scan.service';
import { ScanApiService } from '../../services/scan/scan-api.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { Platform } from '@angular/cdk/platform';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Html5QrcodeResult, Html5QrcodeScanner } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { InventoryScan } from '../../models/inventory.model';
import { InventoryCheckApiService } from '../../services/inventory-check/inventory-check-api.service';
import { InCheckResponse } from '../../models/inventory-check';
import { InventoryService } from '../../services/inventory/inventory.service';

enum Tap {
  Search,
  Camera,
}

enum ScanType {
  QRcode,
  Barcode,
}
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss',
})
export class ScanComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private formBuilder = inject(FormBuilder);
  private scanService = inject(ScanService);
  private scanApiService = inject(ScanApiService);
  private inventoryService = inject(InventoryService);
  private inventoryCheckApiService = inject(InventoryCheckApiService);
  private toastService = inject(ToastNotificationService);
  private validationService = inject(ValidationService);
  platform = inject(Platform);

  @ViewChild('searchInput', { static: true })
  searchInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('qrBox') qrBox: ElementRef<HTMLDivElement>;
  qrRender: HTMLElement;

  title: string = 'รายการ ตรวจสอบครุภัณฑ์';
  selectedTap = new FormControl(Tap.Search);
  imageUrl: string = environment.imageUrl;
  form = this.initForm();

  displayedColumns: string[] = ['image', 'code', 'description', 'action'];
  dataSource = new MatTableDataSource<InventoryScan>([]);
  isLoading: boolean = false;
  isScanning: boolean = false;
  isScanType: number = 0;
  scanSize = { width: 0, height: 0 };
  html5QrcodeScanner: Html5QrcodeScanner = null;

  ngOnInit(): void {
    this.dataSource.data = this.scanService.getInventories();
    this.subscription = this.scanService
      .onInventoriesListener()
      .subscribe((inventoryScan) => (this.dataSource.data = inventoryScan));
  }

  ngAfterViewInit(): void {
    if (!this.platform.ANDROID && !this.platform.IOS)
      this.searchInput.nativeElement.focus();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const inventories = this.scanService.getInventories();
    if (this.validationService.isEmpty(inventories)) return;

    const operations$: Observable<InCheckResponse>[] = [];
    this.isLoading = true;

    for (const inventory of inventories) {
      operations$.push(
        this.inventoryCheckApiService.createInCheck({
          inventoryId: inventory.id,
        })
      );
    }

    from(operations$)
      .pipe(
        concatMap((call) => call.pipe(catchError(() => of(null)))),
        tap(
          (res) =>
            res &&
            this.scanService.deleteInventory(res.inventoryCheck.Inventory.id)
        ),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (res) => res && this.toastService.success('Success', res.message)
      );
  }

  onSearchInventory(): void {
    if (!this.search.value) return;

    const code = this.search.value.replace(/^\s+|\s+$/gm, '');
    this.onGetInventory(code);
  }

  onTapChange(indexTap: number): void {
    if (indexTap !== Tap.Camera) {
      if (this.qrRender) this.qrRender.remove();
      if (this.html5QrcodeScanner) this.html5QrcodeScanner.clear();
      return;
    }

    defer(() =>
      this.qrBox
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.qrBox),
            take(1)
          )
    ).subscribe(() => this.onStartCamera());
  }

  onStartCamera(): void {
    this.isScanning = true;
    if (ScanType.Barcode === this.isScanType)
      this.scanSize = { width: 300, height: 100 };
    else this.scanSize = { width: 250, height: 250 };

    const id = 'qrReader';
    this.qrRender = document.getElementById('div');
    if (!this.qrRender) {
      this.qrRender = document.createElement('div');
      this.qrRender.id = id;
      this.qrRender.className = 'w-100';
      this.qrBox.nativeElement.appendChild(this.qrRender);
    }

    timer(500)
      .pipe(
        finalize(() => timer(300).subscribe(() => (this.isScanning = false)))
      )
      .subscribe(() => {
        this.html5QrcodeScanner = new Html5QrcodeScanner(
          id,
          { fps: 10, qrbox: this.scanSize },
          false
        );

        this.html5QrcodeScanner.render(
          (decodedText: string, decodedResult: Html5QrcodeResult) =>
            this.onScanSuccess(decodedText),
          (errorMessage: string, error: Html5QrcodeError) => null
        );
      });
  }

  onScanSuccess(data: string): void {
    if (this.isScanning == true) return;

    this.isScanning = true;
    this.onGetInventory(data);

    timer(1500).subscribe(() => (this.isScanning = false));
  }

  onGetInventory(data: string): void {
    if (data.length === 7) this.onGetByTrack(data.toUpperCase());
    if (data.length === 28) this.onGetByCode(data);
  }

  onGetByCode(code: string): void {
    const inventoryScan = this.scanService.getInventoryByCode(code);
    if (inventoryScan) return this.search.setValue('');

    const inventory = this.inventoryService.getInventoryByCode(code);
    if (inventory) {
      this.scanService.createInventory(inventory);
      return this.search.setValue('');
    }

    this.isLoading = true;
    this.scanApiService
      .getInventoryByCode(code)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.scanService.createInventory(res);
          this.search.setValue('');
        } else this.toastService.warning('', `${code} ไม่พบข้อมูลครุภัณฑ์`);
      });
  }

  onGetByTrack(track: string) {
    const inventoryScan = this.scanService.getInventoryByTrack(track);
    if (inventoryScan) return this.search.setValue('');

    const inventory = this.inventoryService.getInventoryByTrack(track);
    if (inventory) {
      this.scanService.createInventory(inventory);
      return this.search.setValue('');
    }

    this.isLoading = true;
    this.scanApiService
      .getInventoryByTrack(track)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.scanService.createInventory(res);
          this.search.setValue('');
        } else this.toastService.warning('', `${track} ไม่พบข้อมูลครุภัณฑ์`);
      });
  }

  onDeleteInventory(id: number): void {
    this.scanService.deleteInventory(id);
  }

  clearSearchInput(): void {
    this.search.setValue('');
    this.searchInput.nativeElement.focus();
  }

  onResetInventory(): void {
    this.scanService.resetInventory();
  }

  get search(): FormControl<string> {
    return this.form.controls['search'];
  }

  private initForm() {
    return this.formBuilder.group({
      search: [''],
    });
  }
}
