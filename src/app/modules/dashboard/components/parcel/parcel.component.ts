import {
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
  filter,
  finalize,
  interval,
  of,
  take,
  tap,
} from 'rxjs';
import { ParcelService } from '../../services/parcel/parcel.service';
import { ParcelApiService } from '../../services/parcel/parcel-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FilterList, Parcel, ParcelTable } from '../../models/parcel.model';
import { environment } from '../../../../../environments/environment.development';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { StatusService } from '../../services/status/status.service';

enum Tap {
  Date,
  Track,
}

@Component({
  selector: 'app-parcel',
  templateUrl: './parcel.component.html',
  styleUrl: './parcel.component.scss',
})
export class ParcelComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private subscription = new Subscription();
  private parcelService = inject(ParcelService);
  private parcelApiService = inject(ParcelApiService);
  private categoryService = inject(CategoryService);
  private statusService = inject(StatusService);
  private validationService = inject(ValidationService);
  private operation$: Observable<Parcel[] | Parcel>;

  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('track', { static: true }) track: ElementRef<HTMLInputElement>;

  filterList: FilterList;
  form = this.initForm();

  isLoading: boolean = false;
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
  dataSource = new MatTableDataSource<ParcelTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.parcelService.onParcelsListener().subscribe(() => {
      this.dataSource.data = this.parcelService.getParcelsTable();
      this.initPaginatorAndSort();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.router.navigate(['parcel/new']);
  }

  setFilter(): void {
    this.form.setValue({ category: [], status: [] });
  }

  onSearch(): void {
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

      const parcel = this.parcelService.getParcelByTrackInput(track);
      if (this.validationService.isEmpty(parcel))
        this.operation$ = this.parcelApiService.getParcelByTrack(track);
      else {
        this.dataSource.data = parcel;
        return;
      }
    }

    this.isLoading = true;
    this.operation$
      .pipe(
        tap(() => this.onFilter()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  onSearchAll(): void {
    this.isLoading = true;
    this.parcelApiService
      .getParcels()
      .pipe(
        tap(() => this.setFilter()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  onFilter(): void {
    const parcels = this.parcelService.getParcelsTable();
    const filters = this.form.value;

    this.dataSource.data = Object.keys(filters)
      .reduce(
        (result, keyName) =>
          result.filter((item) => {
            if (filters[keyName].length === 0) return result;
            return filters[keyName].includes(item[keyName]);
          }),
        parcels
      )
      .map((parcel, i) => ({ ...parcel, no: i + 1 }));
  }

  onResetFilter(): void {
    this.filterInput.nativeElement.value = '';
    this.dataSource.filter = '';
    this.setFilter();
    this.onFilter();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get category(): FormControl<string[]> {
    return this.form.controls['category'];
  }

  get status(): FormControl<string[]> {
    return this.form.controls['status'];
  }

  private initForm() {
    return this.formBuilder.group({
      category: this.formBuilder.control<string[]>([]),
      status: this.formBuilder.control<string[]>([]),
    });
  }

  private initDataSource(): void {
    this.dataSource.data = this.parcelService.getParcelsTable();
    this.filterList = {
      categories: this.categoryService.getCategoriesName(),
      statuses: this.statusService.getStatusesName(),
    };

    if (this.validationService.isEmpty(this.dataSource.data)) {
      const startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
      const endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

      this.parcelApiService
        .getParcelsByDate(startDate, endDate)
        .pipe(finalize(() => (this.isFirstLoading = true)))
        .subscribe();

      return;
    }

    this.initPaginatorAndSort();
  }

  private initPaginatorAndSort(): void {
    defer(() =>
      this.paginator && this.sort
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.paginator && !!this.sort),
            take(1)
          )
    ).subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sort.sort({
        id: 'track',
        start: 'desc',
        disableClear: true,
      });
    });
  }
}
