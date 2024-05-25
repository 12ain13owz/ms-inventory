import { Component, OnInit, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Category } from '../../models/category.model';
import { Status } from '../../models/status.model';
import { Usage } from '../../models/usage.model';
import { InventoryService } from '../../services/inventory/inventory.service';
import { CategoryService } from '../../services/category/category.service';
import { CategoryApiService } from '../../services/category/category-api.service';
import { StatusService } from '../../services/status/status.service';
import { StatusApiService } from '../../services/status/status-api.service';
import { UsageService } from '../../services/usage/usage.service';
import { UsageApiService } from '../../services/usage/usage-api.service';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  private validationService = inject(ValidationService);
  private inventoryService = inject(InventoryService);
  private categoryService = inject(CategoryService);
  private categoryApiService = inject(CategoryApiService);
  private statusService = inject(StatusService);
  private statusApiService = inject(StatusApiService);
  private usageService = inject(UsageService);
  private usageApiService = inject(UsageApiService);

  ngOnInit(): void {
    this.inventoryService.setIsLoading(true);

    const categories = this.validationService.isEmpty(
      this.categoryService.getCategories()
    );
    const statuses = this.validationService.isEmpty(
      this.statusService.getStatuses()
    );
    const usages = this.validationService.isEmpty(
      this.usageService.getUsages()
    );
    const operations$: Observable<Category[] | Status[] | Usage[]>[] = [];

    if (categories) operations$.push(this.categoryApiService.getCategories());
    if (statuses) operations$.push(this.statusApiService.getStatuses());
    if (usages) operations$.push(this.usageApiService.getUsages());

    if (!this.validationService.isEmpty(operations$))
      forkJoin(operations$).subscribe(() =>
        this.inventoryService.setIsLoading(false)
      );
    else this.inventoryService.setIsLoading(false);
  }
}
