import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Parcel, ParcelQuantity, ParcelScan } from '../../models/parcel.model';
import {
  Observable,
  Subject,
  catchError,
  concatMap,
  finalize,
  from,
  of,
  tap,
} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../../../environments/environment.development';
import { ScanService } from '../../services/scan/scan.service';
import { ScanApiService } from '../../services/scan/scan-api.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { ParcelApiService } from '../../services/parcel/parcel-api.service';
import { BarcodeFormat } from '@zxing/library';
import { Platform } from '@angular/cdk/platform';

enum Tap {
  Search,
  Camera,
}
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss',
})
export class ScanComponent implements OnInit, AfterViewInit {
  @ViewChild('trackInput', { static: true })
  trackInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatTable) table: MatTable<Parcel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private formBuilder = inject(FormBuilder);
  private scanService = inject(ScanService);
  private scanApiService = inject(ScanApiService);
  private parcelApiService = inject(ParcelApiService);
  private toastService = inject(ToastNotificationService);
  private validationService = inject(ValidationService);
  platform = inject(Platform);

  selectedTap = new FormControl(Tap.Search);
  imageUrl: string = environment.imageUrl;
  form = this.initForm();

  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_128,
    BarcodeFormat.ITF,
  ];

  displayedColumns: string[] = [
    'image',
    'track',
    'quantity',
    'stock',
    'action',
  ];
  dataSource = new MatTableDataSource<ParcelScan>([]);
  isLoading: boolean = false;
  isCamera: boolean = false;
  isScan: boolean = false;
  parcel$ = new Subject();

  ngOnInit(): void {
    this.dataSource.data = this.scanService.getParcels();
    this.scanService.onParcelsListener().subscribe((parcelsScan) => {
      this.dataSource.data = parcelsScan;
    });
  }

  ngAfterViewInit(): void {
    this.trackInput.nativeElement.focus();
  }

  onSubmit(): void {
    const parcels = this.scanService.getParcels();
    if (this.validationService.isEmpty(parcels)) return;

    const operations$: Observable<ParcelQuantity>[] = [];
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

  onScanSuccess(track: string): void {
    if (this.isScan == true) return;

    this.isScan = true;
    this.onGetParcelByTrack(track);
    this.toastService.info('Scan', `${track} สำเร็จ`);

    setTimeout(() => {
      this.isScan = false;
    }, 1000);
  }

  onScanError(): void {
    this.toastService.error('Error', 'Scan ไม่สำเร็จกรุณาลองใหม่');
  }

  onTapChange(indexTap: number): void {
    // if (this.platform.isBrowser) return;

    if (indexTap === Tap.Camera) this.isCamera = true;
    else this.isCamera = false;
  }

  onStartCamera(): void {
    this.isCamera = true;
  }

  onStopCamera(): void {
    this.isCamera = false;
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
        } else this.toastService.error('404', `${track} ไม่พบข้อมูลพัสดุ`);
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
