import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category, CategoryTable } from '../../models/category.model';
import { CategoryService } from '../../services/category/category.service';
import { CategoryApiService } from '../../services/category/category-api.service';
import {
  Subscription,
  defer,
  filter,
  interval,
  take,
  of,
  finalize,
} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';
import {
  SweetAlertComponent,
  SweetAlertInterface,
} from '../../../shared/components/sweet-alert/sweet-alert.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss', '../../scss/table-styles.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SweetAlertComponent) sweetAlert: SweetAlertInterface;

  private subscription = new Subscription();
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);

  title: string = 'รายชื่อประเภท';
  sweetAlertTitle: string;
  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<CategoryTable>([]);
  isFirstLoading: boolean = false;
  id: number;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.categoryService
      .onListener()
      .subscribe(
        () => (this.dataSource.data = this.categoryService.getTableData())
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(CategoryEditComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  onUpdate(item: Category): void {
    this.dialog.open(CategoryEditComponent, {
      data: item,
      width: '500px',
      disableClose: true,
    });
  }

  onConfirm(id: number, title: string): void {
    this.id = id;
    this.sweetAlertTitle = `ยืนยันการลบ ${title}?`;
    this.sweetAlert.alert(this.sweetAlertTitle);
  }

  onDelete(confirm: boolean): void {
    if (!confirm) return;

    this.categoryApiService
      .delete(this.id)
      .subscribe((res) => this.toastService.info('Info', res.message));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.categoryService.getTableData();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.categoryApiService
        .getAll()
        .pipe(finalize(() => (this.isFirstLoading = true)))
        .subscribe();

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
    });
  }
}
