import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  Subscription,
  defer,
  delay,
  filter,
  finalize,
  interval,
  of,
  switchMap,
  take,
  timer,
} from 'rxjs';
import { ParcelService } from '../../services/parcel/parcel.service';
import { ParcelApiService } from '../../services/parcel/parcel-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Parcel, ParcelTable } from '../../models/parcel.model';
import { environment } from '../../../../../environments/environment.development';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

enum Tap {
  Date,
  Track,
}

@Component({
  selector: 'app-parcel',
  templateUrl: './parcel.component.html',
  styleUrl: './parcel.component.scss',
})
export class ParcelComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private subscription = new Subscription();
  private parcelService = inject(ParcelService);
  private parcelApiService = inject(ParcelApiService);
  private validationService = inject(ValidationService);
  private operation$: Observable<Parcel[] | Parcel>;

  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('track', { static: true }) track: ElementRef<HTMLInputElement>;

  selectedTap = new FormControl(Tap.Date);
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDate = new Date();
  dateRange = this.formBuilder.group({
    start: [this.startDate, [Validators.required]],
    end: [this.endDate, [Validators.required]],
  });

  displayedColumns: string[] = [
    'no',
    'image',
    'track',
    'receivedDate',
    'category',
    'status',
    'detail',
    'quantity',
    'action',
  ];
  dataSource = new MatTableDataSource<ParcelTable>(null);
  pageIndex: number = 1;

  ngOnInit(): void {
    this.dataSource.data = this.parcelService.getParcelsTable();
    if (this.validationService.isEmpty(this.dataSource.data)) {
      const startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
      const endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
      this.parcelApiService.getParcelsByDate(startDate, endDate).subscribe();
    }

    this.subscription = this.parcelService
      .onParcelsListener()
      .subscribe(
        () => (this.dataSource.data = this.parcelService.getParcelsTable())
      );
  }

  ngAfterViewInit(): void {
    defer(() =>
      this.paginator && this.sort
        ? of(null)
        : interval(100).pipe(
            filter(() => !!this.paginator && !!this.sort),
            take(1)
          )
    ).subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setPageIndex(event: PageEvent): void {
    this.pageIndex = event.pageIndex * event.pageSize + 1;
  }

  onCreate() {
    this.router.navigate(['parcel/new']);
  }

  onSearch() {
    if (this.selectedTap.value === Tap.Date) {
      if (this.dateRange.invalid) return;

      const startDate = this.datePipe.transform(
        this.dateRange.controls['start'].value,
        'yyyy-MM-dd'
      );
      const endDate = this.datePipe.transform(
        this.dateRange.controls['end'].value,
        'yyyy-MM-dd'
      );
      this.operation$ = this.parcelApiService.getParcelsByDate(
        startDate,
        endDate
      );
    } else if (this.selectedTap.value === Tap.Track) {
      if (!this.track) return;
      const track = this.track.nativeElement.value.replace(/^\s+|\s+$/gm, '');
      if (!track) return;
      this.operation$ = this.parcelApiService.getParcelByTrack(track);
    }

    this.isLoading = true;
    this.operation$.pipe(finalize(() => (this.isLoading = false))).subscribe();
  }

  onSearchAll() {
    this.isLoading = true;
    this.parcelApiService
      .getParcels()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  // onDateFocusOut(dateInput: string, isStartDate: boolean) {
  //   const dateParts = dateInput.split('/');
  //   const date = +dateParts[0];
  //   const month = +dateParts[1] - 1;
  //   const year = +dateParts[2] - 543;
  //   const newDate = new Date(year, month, date);

  //   if (isNaN(newDate.getTime())) return;
  //   if (isStartDate)
  //     this.dateRange.patchValue({
  //       start: newDate,
  //       end: this.dateRange.value.end,
  //     });
  //   else
  //     this.dateRange.patchValue({
  //       start: this.dateRange.value.start,
  //       end: newDate,
  //     });
  // }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
