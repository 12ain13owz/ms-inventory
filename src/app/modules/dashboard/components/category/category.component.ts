import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category/category.service';
import { CategoryApiService } from '../../services/category/category-api.service';
import { Subscription, defer, filter, interval, take, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private validationService = inject(ValidationService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['no', 'name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<Category>([]);
  pageIndex: number = 1;

  ngOnInit(): void {
    this.dataSource.data = this.categoryService.getCategories();
    if (this.validationService.isEmpty(this.dataSource.data))
      this.categoryApiService.getCategories().subscribe();

    this.subscription = this.categoryService
      .onCategoriesListener()
      .subscribe((categories) => (this.dataSource.data = categories));
  }

  ngAfterViewInit(): void {
    defer(() =>
      this.paginator && this.sort
        ? of(null)
        : interval(100).pipe(
            filter(() => !!this.paginator && !!this.sort),
            take(1)
          )
    ).subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setPageIndex(event: PageEvent): void {
    this.pageIndex = event.pageIndex * event.pageSize + 1;
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
    this.categoryApiService.deleteCategory(id).subscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
