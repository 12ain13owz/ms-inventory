import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import {
  Observable,
  Subscription,
  defer,
  filter,
  finalize,
  interval,
  map,
  of,
  startWith,
  take,
} from 'rxjs';
import { InventoryCheckService } from '../../services/inventory-check/inventory-check.service';
import { InventoryCheckApiService } from '../../services/inventory-check/inventory-check-api.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../services/category/category.service';
import { StatusService } from '../../services/status/status.service';
import { UsageService } from '../../services/usage/usage.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FilterInventory, InventoryTable } from '../../models/inventory.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-inventory-check',
  templateUrl: './inventory-check.component.html',
  styleUrl: './inventory-check.component.scss',
})
export class InventoryCheckComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private inventoryCheckService = inject(InventoryCheckService);
  private inventoryCheckApiService = inject(InventoryCheckApiService);
  private categoryService = inject(CategoryService);
  private assetStatusService = inject(StatusService);
  private usageStatusService = inject(UsageService);
  private validationService = inject(ValidationService);

  private subscription = new Subscription();
  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;

  filter: FilterInventory = {
    categories: this.categoryService.getActiveCategoriesName(),
    statuses: this.assetStatusService.getActiveStatusNames(),
    usages: this.usageStatusService.getActiveUsageNames(),
  };
  form = this.initForm();

  title: string = 'รายการ ตรวจสอบครุภัณฑ์';
  years: string[] = [];
  selectYear = new FormControl<string>(null);
  filteredOptions: Observable<string[]>;
  isLoading: boolean = false;

  displayedColumns: string[] = [
    'no',
    'image',
    'code',
    'year',
    'category',
    'status',
    'usage',
    'description',
  ];
  dataSource = new MatTableDataSource<InventoryTable>([]);

  ngOnInit(): void {
    this.initDataSource();
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    const isYear = this.years.includes(this.selectYear.value);
    if (!isYear) return;

    const year = +this.selectYear.value - 543;
    this.isLoading = true;
    this.inventoryCheckApiService
      .getInChecksByYear(year)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  setFilter(): void {
    this.form.setValue({ category: [], status: [], usage: [] });
  }

  onFilter(): void {
    const inventories = this.inventoryCheckService.getInChecksTable();
    const filters = this.form.value;

    this.dataSource.data = Object.keys(filters)
      .reduce(
        (result, keyName) =>
          result.filter((item) => {
            if (filters[keyName].length === 0) return result;
            return filters[keyName].includes(item[keyName]);
          }),
        inventories
      )
      .map((inventory, i) => ({ ...inventory, no: i + 1 }));
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

  get usage(): FormControl<string[]> {
    return this.form.controls['usage'];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.years.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private initDataSource() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1896; i--) {
      this.years.push((i + 543).toString());
    }
    this.filteredOptions = this.selectYear.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.dataSource.data = this.inventoryCheckService.getInChecksTable();
    if (!this.validationService.isEmpty(this.dataSource.data)) {
      this.initPaginatorAndSort();
    }
  }

  private initForm() {
    return this.formBuilder.group({
      category: this.formBuilder.control<string[]>([]),
      status: this.formBuilder.control<string[]>([]),
      usage: this.formBuilder.control<string[]>([]),
    });
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
        id: 'no',
        start: 'desc',
        disableClear: true,
      });
    });
  }

  private initSubscriptions() {
    this.subscription.add(
      this.inventoryCheckService.onInChecksListener().subscribe(() => {
        this.dataSource.data = this.inventoryCheckService.getInChecksTable();
        this.initPaginatorAndSort();
      })
    );

    this.subscription.add(
      this.categoryService.onCategoriesListener().subscribe(() => {
        this.filter.categories = this.categoryService.getActiveCategoriesName();
      })
    );

    this.subscription.add(
      this.assetStatusService.onStatusesListener().subscribe(() => {
        this.filter.statuses = this.assetStatusService.getActiveStatusNames();
      })
    );

    this.subscription.add(
      this.usageStatusService.onUsagesListener().subscribe(() => {
        this.filter.usages = this.usageStatusService.getActiveUsageNames();
      })
    );
  }
}
