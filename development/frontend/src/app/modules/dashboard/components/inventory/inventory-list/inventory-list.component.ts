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
  map,
  merge,
  of,
  startWith,
  take,
  tap,
} from 'rxjs';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryApiService } from '../../../services/inventory/inventory-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { PrintService } from '../../../services/print/print.service';
import {
  InventoryFilter,
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
import { SearchService } from '../../../services/search/search.service';

enum Tap {
  Code,
  Date,
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
  private statusService = inject(StatusService);
  private validationService = inject(ValidationService);
  private printService = inject(PrintService);
  private searchService = inject(SearchService);
  private operation$: Observable<Inventory[] | Inventory>;
  private snackBar = inject(MatSnackBar);
  private platfrom = inject(Platform);

  private subscription = new Subscription();
  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;

  filter: InventoryFilter = {
    categories: this.categoryService.getActiveNames(),
    statuses: this.statusService.getActiveNames(),
  };
  form = this.initForm();

  title: string = 'รายการ ครุภัณฑ์';
  isLoading: boolean = false;
  isSort: boolean = false;
  isSelected: boolean = false;
  isPrint: boolean = false;
  selectedTap = new FormControl(Tap.Code);
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
    'location',
    'receivedDate',
    'description',
  ];
  dataSource = new MatTableDataSource<InventoryTable>([]);
  selection = new SelectionModel<InventoryTable>(true, []);
  isFirstLoading: boolean = false;

  search = new FormControl('');
  cache: string[] = [];
  filteredOptions: Observable<string[]>;

  ngOnInit(): void {
    this.initDataSource();
    this.initSubscriptions();

    if (this.activatedRoute.snapshot.queryParams['isPrint'] === 'true')
      this.isPrint = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearchAutoComplete(query: string): void {
    this.searchService.search$.next(query);
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
      this.operation$ = this.inventoryApiService.getByDate(startDate, endDate);
    } else if (this.selectedTap.value === Tap.Code) {
      if (!this.search.value) return;

      const code = this.search.value.replace(/^\s+|\s+$/gm, '');
      if (!code) return;

      const inventory = this.inventoryService.getTableDataWithCode(code);

      if (!this.validationService.isEmpty(inventory)) {
        this.dataSource.data = inventory;
        return;
      }

      this.operation$ = this.inventoryApiService.searchByCode(code);
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
      .getAll()
      .pipe(
        tap(() => this.setFilter()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  setFilter(): void {
    this.form.setValue({ category: [], status: [] });
  }

  onFilter(): void {
    const inventories = this.inventoryService.getTableData();
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
      .filter((inventory) => !this.printService.getById(inventory.id))
      .map((inventory) => ({
        id: inventory.id,
        track: inventory.track,
        image: inventory.image,
        code: inventory.code,
        description: inventory.description,
        printCount: 1,
      }));

    for (const inventory of inventories) {
      this.printService.create(inventory);
    }
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
    this.dataSource.data = this.inventoryService.getTableData();
    if (this.validationService.isEmpty(this.dataSource.data)) {
      this.inventoryApiService
        .getInit()
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
      this.inventoryService.onListener().subscribe(() => {
        this.dataSource.data = this.inventoryService.getTableData();
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

    this.subscription.add(
      this.searchService
        .onListener()
        .subscribe((cache) => (this.cache = this.searchService.getCache()))
    );

    this.filteredOptions = merge(
      this.search.valueChanges,
      this.searchService.onListener().pipe(map(() => this.search.value))
    ).pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.cache.filter((option) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }
}
