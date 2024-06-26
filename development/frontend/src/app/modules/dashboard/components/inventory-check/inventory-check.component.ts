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
import { ValidationService } from '../../../shared/services/validation.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryFilter, InventoryTable } from '../../models/inventory.model';
import { MatTableDataSource } from '@angular/material/table';
import {
  SweetAlertComponent,
  SweetAlertInterface,
} from '../../../shared/components/sweet-alert/sweet-alert.component';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import { ProfileService } from '../../services/profile/profile.service';
import { InventoryCheckTable } from '../../models/inventory-check';

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
  private statusService = inject(StatusService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private profileService = inject(ProfileService);

  private subscription = new Subscription();
  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;
  isAdmin: boolean = this.profileService.isAdmin();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SweetAlertComponent) sweetAlert: SweetAlertInterface;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;

  filter: InventoryFilter = {
    categories: this.categoryService.getActiveNames(),
    statuses: this.statusService.getActiveNames(),
  };
  form = this.initForm();

  title: string = 'รายการ ตรวจสอบครุภัณฑ์';
  sweetAlertTitle: string = '';
  years: string[] = [];
  selectYear = new FormControl<string>(null);
  filteredOptions: Observable<string[]>;
  isLoading: boolean = false;
  id: number;

  displayedColumns: string[] = [
    'no',
    'image',
    'code',
    'year',
    'category',
    'status',
    'location',
    'description',
  ];
  dataSource = new MatTableDataSource<InventoryCheckTable>([]);

  ngOnInit(): void {
    if (this.isAdmin) this.displayedColumns.push('action');

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
      .getByYear(year)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe();
  }

  setFilter(): void {
    this.form.setValue({ category: [], status: [] });
  }

  onFilter(): void {
    const inventories = this.inventoryCheckService.getTableData();
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

  onConfirm(id: number, title: string): void {
    this.id = id;
    this.sweetAlertTitle = `ยืนยันการลบตรวจสอบครุภัณฑ์\n${title}?`;
    this.sweetAlert.alert(this.sweetAlertTitle);
  }

  onDelete(confirm: boolean): void {
    if (!confirm) return;

    this.inventoryCheckApiService
      .delete(this.id)
      .subscribe((res) => this.toastService.info('Info', res.message));
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.years.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private initDataSource() {
    const startYear = 2567;
    const currentYear = new Date().getFullYear() + 543;
    const futureYear = currentYear + 20;

    for (let i = startYear; i <= futureYear; i++) {
      this.years.push(i.toString());
    }

    this.filteredOptions = this.selectYear.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );

    this.dataSource.data = this.inventoryCheckService.getTableData();
    if (!this.validationService.isEmpty(this.dataSource.data)) {
      this.initPaginatorAndSort();
    }
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
      this.inventoryCheckService.onListener().subscribe(() => {
        this.dataSource.data = this.inventoryCheckService.getTableData();
        this.initPaginatorAndSort();
      })
    );

    this.subscription.add(
      this.categoryService.onListener().subscribe(() => {
        this.filter.categories = this.categoryService.getActiveNames();
      })
    );

    this.subscription.add(
      this.statusService.onListener().subscribe(() => {
        this.filter.statuses = this.statusService.getActiveNames();
      })
    );
  }
}
