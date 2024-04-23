import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { LogService } from '../../../services/log/log.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment.development';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FilterLog, Log, LogTable } from '../../../models/log.model';
import { ValidationService } from '../../../../shared/services/validation.service';
import { LogApiService } from '../../../services/log/log-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';

enum Tap {
  Date,
  Track,
}
@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrl: './log-list.component.scss',
})
export class LogListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private statusService = inject(StatusService);
  private logService = inject(LogService);
  private logApiService = inject(LogApiService);
  private validationService = inject(ValidationService);
  private operation$: Observable<Log[]>;

  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('track', { static: true }) track: ElementRef<HTMLInputElement>;

  filterLog: FilterLog = {
    parcelStatus: [
      'เพิ่มพัสดุ',
      'แก้ไขพัสดุ',
      'เพิ่มสต็อก',
      'ตัดสต็อก',
      'ปริ้น',
    ],
    categories: this.categoryService.getActiveCategoriesName(),
    statuses: this.statusService.getActiveStatusesName(),
  };
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
    'category',
    'status',
    'modifyQuantity',
    'printCount',
    'detailLog',
    'createdAt',
  ];
  dataSource = new MatTableDataSource<LogTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();

    this.subscription = this.logService.onLogsListener().subscribe(() => {
      this.dataSource.data = this.logService.getLogsTable();
      this.initPaginatorAndSort();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      this.operation$ = this.logApiService.getLogsByDate(startDate, endDate);
    } else if (this.selectedTap.value === Tap.Track) {
      if (!this.track) return;

      const track = this.track.nativeElement.value.replace(/^\s+|\s+$/gm, '');
      if (!track) return;

      this.operation$ = this.logApiService.getLogsByTrack(track);
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
    this.logApiService
      .getAllLogs()
      .pipe(
        tap(() => this.setFilter()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  setFilter(): void {
    this.form.setValue({ parcelStatus: [], category: [], status: [] });
  }

  onFilter(): void {
    const logs = this.logService.getLogs();
    const filters = {
      categoryName: this.category.value,
      statusName: this.status.value,
    };

    const logFilter = Object.keys(filters).reduce(
      (result, keyName) =>
        result.filter((log) => {
          if (filters[keyName].length === 0) return result;
          return filters[keyName].includes(log[keyName]);
        }),
      logs
    );

    if (this.validationService.isEmpty(this.parcelStatus.value)) {
      this.dataSource.data = logFilter.map((log, i) => ({
        ...log,
        no: i + 1,
      }));
      return;
    }

    const newParcel = this.parcelStatus.value.includes('เพิ่มพัสดุ');
    const editParcel = this.parcelStatus.value.includes('แก้ไขพัสดุ');
    const increaseQuantity = this.parcelStatus.value.includes('เพิ่มสต็อก');
    const decreaseQuantity = this.parcelStatus.value.includes('ตัดสต็อก');
    const print = this.parcelStatus.value.includes('ปริ้น');

    this.dataSource.data = logFilter
      .filter(
        (log) =>
          (log.newParcel && newParcel) ||
          (log.editParcel && editParcel) ||
          (log.increaseQuantity && increaseQuantity) ||
          (log.decreaseQuantity && decreaseQuantity) ||
          (log.print && print)
      )
      .map((log, i) => ({ ...log, no: i + 1 }));
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

  get parcelStatus(): FormControl<string[]> {
    return this.form.controls['parcelStatus'];
  }

  get category(): FormControl<string[]> {
    return this.form.controls['category'];
  }

  get status(): FormControl<string[]> {
    return this.form.controls['status'];
  }

  private initForm() {
    return this.formBuilder.group({
      parcelStatus: this.formBuilder.control<string[]>([]),
      category: this.formBuilder.control<string[]>([]),
      status: this.formBuilder.control<string[]>([]),
    });
  }

  private initDataSource(): void {
    this.dataSource.data = this.logService.getLogsTable();
    if (this.validationService.isEmpty(this.dataSource.data)) {
      this.logApiService
        .getInitialLogs()
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
      if (!this.dataSource.paginator)
        this.dataSource.paginator = this.paginator;

      if (!this.dataSource.sort) {
        this.dataSource.sort = this.sort;
        this.dataSource.sort.sort({
          id: 'createdAt',
          start: 'desc',
          disableClear: true,
        });
      }
    });
  }
}
