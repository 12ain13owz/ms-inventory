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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ValidationService } from '../../../shared/services/validation.service';
import { ToastNotificationService } from '../../../../core/services/toast-notification.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private subscription = new Subscription();
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastNotificationService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<CategoryTable>([]);
  isFirstLoading: boolean = false;

  ngOnInit(): void {
    this.initDataSource();
    this.subscription = this.categoryService
      .onCategoriesListener()
      .subscribe(
        () => (this.dataSource.data = this.categoryService.getCategoriesTable())
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

  onUpdate(category: Category): void {
    this.dialog.open(CategoryEditComponent, {
      data: category,
      width: '500px',
      disableClose: true,
    });
  }

  onDelete(id: number): void {
    this.categoryApiService
      .deleteCategory(id)
      .subscribe((res) => this.toastService.info('Delete', res.message));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private initDataSource(): void {
    this.dataSource.data = this.categoryService.getCategoriesTable();

    if (this.validationService.isEmpty(this.dataSource.data))
      this.categoryApiService
        .getCategories()
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
