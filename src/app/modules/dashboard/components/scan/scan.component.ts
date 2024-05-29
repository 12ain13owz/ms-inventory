import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  Observable,
  defer,
  filter,
  finalize,
  interval,
  of,
  take,
  timer,
} from 'rxjs';
import { ScanApiService } from '../../services/scan/scan-api.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { Platform } from '@angular/cdk/platform';
import { Html5QrcodeResult, Html5QrcodeScanner } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import { InventoryService } from '../../services/inventory/inventory.service';
import { Inventory } from '../../models/inventory.model';
import { MatDialog } from '@angular/material/dialog';
import { ScanEditComponent } from './scan-edit/scan-edit.component';

enum Tap {
  Camera,
  Search,
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
export class ScanComponent implements OnInit, AfterViewInit {
  private formBuilder = inject(FormBuilder);
  private scanApiService = inject(ScanApiService);
  private inventoryService = inject(InventoryService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);
  private operation$: Observable<Inventory>;

  platform = inject(Platform);

  @ViewChild('searchInput', { static: true })
  searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('qrBox') qrBox: ElementRef<HTMLDivElement>;
  qrRender: HTMLElement;

  title: string = 'รายการ ตรวจสอบครุภัณฑ์';
  selectedTap = new FormControl(Tap.Search);
  form = this.initForm();

  isLoading: boolean = false;
  isScanning: boolean = false;
  isScanType: number = 0;
  scanSize = { width: 0, height: 0 };
  html5QrcodeScanner: Html5QrcodeScanner = null;

  ngOnInit(): void {
    defer(() =>
      this.qrBox
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.qrBox),
            take(1)
          )
    ).subscribe(() => this.onStartCamera());
  }

  ngAfterViewInit(): void {
    if (!this.platform.ANDROID && !this.platform.IOS)
      this.searchInput.nativeElement.focus();
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

  onSearchInventory(): void {
    if (!this.search.value) return;

    const code = this.search.value.replace(/^\s+|\s+$/gm, '');
    this.determineType(code);
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
    this.determineType(data);
  }

  determineType(data: string): void {
    if (data.length === 7) {
      this.onGetInventory('track', data.toUpperCase());
      return;
    }
    this.onGetInventory('code', data);
  }

  onGetInventory(type: 'code' | 'track', data: string): void {
    let inventory: Inventory;

    if (type === 'code') inventory = this.inventoryService.getByCode(data);
    else inventory = this.inventoryService.getByTrack(data);

    if (inventory) {
      this.search.setValue('');
      this.dialogOpen(inventory);
      return;
    }

    this.isLoading = true;
    this.operation$ =
      type === 'code'
        ? this.scanApiService.getByCode(data)
        : this.scanApiService.getByTrack(data);

    this.operation$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.search.setValue('');
          this.dialogOpen(res);
          return;
        }

        timer(1500).subscribe(() => (this.isScanning = false));
        this.toastService.warning('', `${data} ไม่พบข้อมูลครุภัณฑ์`);
      });
  }

  dialogOpen(inventory: Inventory): void {
    this.dialog
      .open(ScanEditComponent, {
        data: inventory,
        width: '500px',
      })
      .afterClosed()
      .subscribe(() => timer(500).subscribe(() => (this.isScanning = false)));
  }

  clearSearchInput(): void {
    this.search.setValue('');
    this.searchInput.nativeElement.focus();
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
