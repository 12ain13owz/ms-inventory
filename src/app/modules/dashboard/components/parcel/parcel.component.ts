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
  Subscription,
  delay,
  delayWhen,
  filter,
  interval,
  map,
  of,
  switchMap,
  take,
  tap,
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    if (this.validationService.isEmpty(this.dataSource.data))
      this.parcelApiService.getParcels().subscribe();

    this.subscription = this.parcelService
      .onParcelsListener()
      .pipe(
        filter((parcels) => parcels !== null),
        tap(() => {
          this.dataSource.data = this.parcelService.getParcelsTable();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
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

  onEdit(id: number): void {
    this.router.navigate([`parcel/edit/${id}`]);
  }

  onSearch() {
    if (this.selectedTap.value === Tap.Date) {
      console.log(this.dateRange.value);
    }
    this.parcelService.setParcels([]);
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
