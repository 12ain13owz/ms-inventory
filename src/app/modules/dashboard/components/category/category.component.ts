import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category, CategoryForm } from '../../models/category.model';
import { CategoryService } from '../../services/category/category.service';
import { CategoryApiService } from '../../services/category/category-api.service';
import { Subscription, delayWhen, interval, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'active', 'remark', 'action'];
  dataSource = new MatTableDataSource<Category>(null);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.subscription = this.categoryService
      .onCategoriesListener()
      .pipe(
        tap((categories) => (this.dataSource.data = categories)),
        delayWhen(() => (this.paginator ? interval(0) : interval(100)))
      )
      .subscribe(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreate(): void {
    this.dialog.open(CategoryEditComponent, {
      width: '500px',
    });
  }

  onUpdate(category: Category): void {
    this.dialog.open(CategoryEditComponent, {
      data: category,
      width: '500px',
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
