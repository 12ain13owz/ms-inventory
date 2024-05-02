import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ParcelService } from '../../../services/parcel/parcel.service';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import { CategoryService } from '../../../services/category/category.service';
import { StatusService } from '../../../services/status/status.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import {
  FilterParcel,
  Parcel,
  ParcelTable,
} from '../../../models/parcel.model';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PrintService } from '../../../services/print/print.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';

enum Tap {
  Date,
  Code,
  Track,
}
@Component({
  selector: 'app-parcel-list',
  templateUrl: './parcel-list.component.html',
  styleUrl: './parcel-list.component.scss',
})
export class ParcelListComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private subscription = new Subscription();
  private parcelService = inject(ParcelService);
  private parcelApiService = inject(ParcelApiService);
  private categoryService = inject(CategoryService);
  private statusService = inject(StatusService);
  private validationService = inject(ValidationService);
  private printService = inject(PrintService);
  private operation$: Observable<Parcel[] | Parcel>;
  private snackBar = inject(MatSnackBar);
  private platfrom = inject(Platform);

  datePipe = inject(DatePipe);
  imageUrl: string = environment.imageUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('code', { static: true }) code: ElementRef<HTMLInputElement>;
  @ViewChild('track', { static: true }) track: ElementRef<HTMLInputElement>;

  filterParcel: FilterParcel = {
    categories: this.categoryService.getActiveCategoriesName(),
    statuses: this.statusService.getActiveStatusesName(),
  };
  form = this.initForm();

  isLoading: boolean = false;
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
    'track',
    'receivedDate',
    'category',
    'status',
    'quantity',
    'detail',
  ];
  dataSource = new MatTableDataSource<ParcelTable>([]);
  selection = new SelectionModel<ParcelTable>(true, []);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();

    this.subscription = this.parcelService.onParcelsListener().subscribe(() => {
      this.dataSource.data = this.parcelService.getParcelsTable();
      this.initPaginatorAndSort();
    });

    if (this.activatedRoute.snapshot.queryParams['isPrint'] === 'true')
      this.isPrint = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.router.navigate(['parcel/new']);
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
    } else if (this.selectedTap.value === Tap.Code) {
      if (!this.code) return;

      const code = this.code.nativeElement.value.replace(/^\s+|\s+$/gm, '');
      if (!code) return;

      this.operation$ = this.parcelApiService.getParcelsByCode(code);
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
      .getAllParcels()
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

    this.snackBar.open('เพิ่มพัสดุไปยังหน้าปริ้น', 'ปิด', {
      duration: 2500,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
    });

    const parcels = this.selection.selected
      .filter((parcel) => !this.printService.getParcelById(parcel.id))
      .map((parcel) => ({
        id: parcel.id,
        image: parcel.image,
        track: parcel.track,
        quantity: parcel.quantity,
        print: parcel.print,
        printCount: parcel.quantity,
      }));

    for (const parcel of parcels) this.printService.createParcel(parcel);
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
    if (this.validationService.isEmpty(this.dataSource.data)) {
      this.parcelApiService
        .getInitialParcels()
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
          id: 'track',
          start: 'desc',
          disableClear: true,
        });
      }
      if (this.isPrint) {
        this.isSelected = this.isPrint;
        this.isSelectPrint();
      }
    });
  }
}
