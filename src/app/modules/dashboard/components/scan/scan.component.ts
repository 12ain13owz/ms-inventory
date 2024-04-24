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
import { ParcelQuantityResponse, ParcelScan } from '../../models/parcel.model';
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
import { ParcelApiService } from '../../services/parcel/parcel-api.service';
import { Platform } from '@angular/cdk/platform';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Html5QrcodeResult, Html5QrcodeScanner } from 'html5-qrcode';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';

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
  private parcelApiService = inject(ParcelApiService);
  private toastService = inject(ToastNotificationService);
  private validationService = inject(ValidationService);
  platform = inject(Platform);

  @ViewChild('trackInput', { static: true })
  trackInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('qrBox') qrBox: ElementRef<HTMLDivElement>;
  qrRender: HTMLElement;

  selectedTap = new FormControl(Tap.Search);
  imageUrl: string = environment.imageUrl;
  form = this.initForm();

  displayedColumns: string[] = [
    'image',
    'track',
    'quantity',
    'stock',
    'action',
  ];
  dataSource = new MatTableDataSource<ParcelScan>([]);
  isLoading: boolean = false;
  isScanning: boolean = false;
  isScanType: number = 0;
  scanSize = { width: 0, height: 0 };
  html5QrcodeScanner: Html5QrcodeScanner = null;

  ngOnInit(): void {
    this.dataSource.data = this.scanService.getParcels();
    this.subscription = this.scanService
      .onParcelsListener()
      .subscribe((parcelsScan) => (this.dataSource.data = parcelsScan));
  }

  ngAfterViewInit(): void {
    if (!this.platform.ANDROID && !this.platform.IOS)
      this.trackInput.nativeElement.focus();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const parcels = this.scanService.getParcels();
    if (this.validationService.isEmpty(parcels)) return;

    const operations$: Observable<ParcelQuantityResponse>[] = [];
    this.isLoading = true;

    for (const parcel of parcels) {
      operations$.push(
        this.parcelApiService.decrementParcel(parcel.id, parcel.stock)
      );
    }

    from(operations$)
      .pipe(
        concatMap((call) => call.pipe(catchError(() => of(null)))),
        tap((res) => res && this.scanService.deleteParcle(res.id)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        (res) => res && this.toastService.success('Success', res.message)
      );
  }

  onSearchParcel(): void {
    if (!this.track.value) return;

    const track = this.track.value.replace(/^\s+|\s+$/gm, '');
    this.onGetParcelByTrack(track);
  }

  onTapChange(indexTap: number): void {
    if (!this.platform.ANDROID && !this.platform.IOS) return;
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

  onScanSuccess(track: string): void {
    if (this.isScanning == true) return;

    this.isScanning = true;
    this.onGetParcelByTrack(track);

    timer(1500).subscribe(() => (this.isScanning = false));
  }

  onGetParcelByTrack(track: string): void {
    const parcel = this.scanService.getParcelByTrack(track);

    if (parcel) {
      this.scanService.incrementStockParcel(parcel.id);
      return this.track.setValue('');
    }

    this.isLoading = true;
    this.scanApiService
      .getParcelByTrack(track)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        if (res) {
          this.scanService.createParcelScan(res);
          this.track.setValue('');
        } else this.toastService.warning('', `${track} ไม่พบข้อมูลพัสดุ`);
      });
  }

  onBlurStock(event: Event, id: number): void {
    const parcel = this.scanService.getParcelById(id);
    if (!parcel) return;

    const el = event.target as HTMLInputElement;
    el.value = el.value.replace(/[^0-9]/g, '');

    if (+el.value <= 0) el.value = '1';
    if (+el.value >= parcel.quantity) el.value = parcel.quantity.toString();

    this.scanService.updateStockParcel(id, +el.value);
  }

  incrementStock(id: number): void {
    this.scanService.incrementStockParcel(id);
  }

  decrementStock(id: number): void {
    this.scanService.decrementStockParcel(id);
  }

  onDeleteParcel(id: number): void {
    this.scanService.deleteParcle(id);
  }

  clearTrackInput(): void {
    this.track.setValue('');
    this.trackInput.nativeElement.focus();
  }

  onResetParcel(): void {
    this.scanService.resetParcel();
  }

  get track(): FormControl<string> {
    return this.form.controls['track'];
  }

  private initForm() {
    return this.formBuilder.group({
      track: [''],
    });
  }
}
