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
import { environment } from '../../../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FilterLog, Log, LogTable } from '../../../models/log.model';
import { ValidationService } from '../../../../shared/services/validation.service';
import { LogApiService } from '../../../services/log/log-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { UsageService } from '../../../services/usage/usage.service';

enum Tap {
  Date,
  Code,
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
  private usageService = inject(UsageService);
  private logService = inject(LogService);
  private logApiService = inject(LogApiService);
  private validationService = inject(ValidationService);
  private operation$: Observable<Log[]>;

  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('code', { static: true }) code: ElementRef<HTMLInputElement>;

  title: string = 'รายการ ประว้ติครุภัณฑ์';
  filterLog: FilterLog = {
    inventories: ['เพิ่มพัสดุ', 'แก้ไขพัสดุ'],
    categories: this.categoryService.getActiveCategoriesName(),
    statuses: this.statusService.getActiveStatusNames(),
    usages: this.usageService.getActiveUsageNames(),
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
    'code',
    'category',
    'status',
    'usage',
    'isCreated',
    'description',
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
    } else if (this.selectedTap.value === Tap.Code) {
      if (!this.code) return;

      const code = this.code.nativeElement.value.replace(/^\s+|\s+$/gm, '');
      if (!code) return;

      this.operation$ = this.logApiService.getLogsByCode(code);
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
    this.form.setValue({
      inventory: [],
      category: [],
      status: [],
      usage: [],
    });
  }

  onFilter(): void {
    const logs = this.logService.getLogs();
    const filters = {
      categoryName: this.category.value,
      statusName: this.status.value,
      usageName: this.usage.value,
    };

    const logFilter = Object.keys(filters).reduce(
      (result, keyName) =>
        result.filter((log) => {
          if (filters[keyName].length === 0) return result;
          return filters[keyName].includes(log[keyName]);
        }),
      logs
    );

    if (this.validationService.isEmpty(this.inventory.value)) {
      this.dataSource.data = logFilter.map((log, i) => ({
        ...log,
        no: i + 1,
      }));
      return;
    }

    const newParcel = this.inventory.value.includes('เพิ่มพัสดุ');
    const editParcel = this.inventory.value.includes('แก้ไขพัสดุ');

    this.dataSource.data = logFilter
      .filter(
        (log) => (log.isCreated && newParcel) || (!log.isCreated && editParcel)
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

  get inventory(): FormControl<string[]> {
    return this.form.controls['inventory'];
  }

  get category(): FormControl<string[]> {
    return this.form.controls['category'];
  }

  get status(): FormControl<string[]> {
    return this.form.controls['status'];
  }

  get usage(): FormControl<string[]> {
    return this.form.controls['usage'];
  }

  private initForm() {
    return this.formBuilder.group({
      inventory: this.formBuilder.control<string[]>([]),
      category: this.formBuilder.control<string[]>([]),
      status: this.formBuilder.control<string[]>([]),
      usage: this.formBuilder.control<string[]>([]),
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
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sort.sort({
        id: 'createdAt',
        start: 'desc',
        disableClear: true,
      });
    });
  }
}
