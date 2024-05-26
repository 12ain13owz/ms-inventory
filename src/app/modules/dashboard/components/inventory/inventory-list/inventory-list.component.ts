import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryApiService } from '../../../services/inventory/inventory-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { UsageService } from '../../../services/usage/usage.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { PrintService } from '../../../services/print/print.service';
import {
  FilterInventory,
  Inventory,
  InventoryTable,
} from '../../../models/inventory.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

enum Tap {
  Date,
  Code,
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
})
export class InventoryListComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private inventoryApiService = inject(InventoryApiService);
  private categoryService = inject(CategoryService);
  private assetStatusService = inject(StatusService);
  private usageStatusService = inject(UsageService);
  private validationService = inject(ValidationService);
  private printService = inject(PrintService);
  private operation$: Observable<Inventory[] | Inventory>;
  private snackBar = inject(MatSnackBar);
  private platfrom = inject(Platform);

  private subscription = new Subscription();
  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('code', { static: true }) code: ElementRef<HTMLInputElement>;

  filter: FilterInventory = {
    categories: this.categoryService.getActiveCategoriesName(),
    statuses: this.assetStatusService.getActiveStatusNames(),
    usages: this.usageStatusService.getActiveUsageNames(),
  };
  form = this.initForm();

  title: string = 'รายการ ครุภัณฑ์';
  isLoading: boolean = false;
  isSort: boolean = false;
  isSelected: boolean = false;
  isPrint: boolean = false;
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
    'description',
  ];
  dataSource = new MatTableDataSource<InventoryTable>([]);
  selection = new SelectionModel<InventoryTable>(true, []);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.initSubscriptions();

    if (this.activatedRoute.snapshot.queryParams['isPrint'] === 'true')
      this.isPrint = true;
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
      this.operation$ = this.inventoryApiService.getInventorysByDate(
        startDate,
        endDate
      );
    } else if (this.selectedTap.value === Tap.Code) {
      if (!this.code) return;

      const code = this.code.nativeElement.value.replace(/^\s+|\s+$/gm, '');
      if (!code) return;

      const inventory = this.inventoryService.getInventoryByCodeTable(code);
      if (this.validationService.isEmpty(inventory))
        this.operation$ = this.inventoryApiService.getInventoryByCode(code);
      else {
        this.dataSource.data = inventory;
        return;
      }

      this.operation$ = this.inventoryApiService.getInventoryByCode(code);
    }

    this.isLoading = true;
    this.isSort = false;
    this.operation$
      .pipe(
        tap(() => this.onFilter()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  onSearchAll(): void {
    this.isLoading = true;
    this.isSort = false;
    this.inventoryApiService
      .getAllInventorys()
      .pipe(
        tap(() => this.setFilter()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  setFilter(): void {
    this.form.setValue({ category: [], status: [], usage: [] });
  }

  onFilter(): void {
    const inventories = this.inventoryService.getInventoriesTable();
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

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  isSelectPrint() {
    if (this.isSelected) this.displayedColumns.unshift('select');
    else this.displayedColumns.shift();
  }

  addToPrint(): void {
    let horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    let verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    if (this.platfrom.ANDROID || this.platfrom.IOS) {
      horizontalPosition = 'center';
      verticalPosition = 'top';
    }

    this.snackBar.open('เพิ่มครุภัณฑ์ไปยังรายการพิมพ์', 'ปิด', {
      duration: 2500,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });

    const inventories = this.selection.selected
      .filter((inventory) => !this.printService.getInventoryById(inventory.id))
      .map((inventory) => ({
        id: inventory.id,
        image: inventory.image,
        code: inventory.code,
        description: inventory.description,
        printCount: 1,
      }));

    for (const inventory of inventories)
      this.printService.createInventory(inventory);
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
      category: this.formBuilder.control<string[]>([]),
      status: this.formBuilder.control<string[]>([]),
      usage: this.formBuilder.control<string[]>([]),
    });
  }

  private initDataSource(): void {
    this.dataSource.data = this.inventoryService.getInventoriesTable();
    if (this.validationService.isEmpty(this.dataSource.data)) {
      this.inventoryApiService
        .getInitialInventorys()
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

      if (!this.isSort) {
        this.dataSource.sort.sort({
          id: 'code',
          start: 'desc',
          disableClear: true,
        });

        this.isSort = true;
      }
      if (this.isPrint) {
        this.isSelected = this.isPrint;
        this.isSelectPrint();
      }
    });
  }

  private initSubscriptions() {
    this.subscription.add(
      this.inventoryService.onInventoriesListener().subscribe(() => {
        this.dataSource.data = this.inventoryService.getInventoriesTable();
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
