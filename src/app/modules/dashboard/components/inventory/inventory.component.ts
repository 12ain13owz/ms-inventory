import { Component, OnInit, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Category } from '../../models/category.model';
import { Status } from '../../models/status.model';
import { Fund } from '../../models/fund.model';
import { InventoryService } from '../../services/inventory/inventory.service';
import { CategoryService } from '../../services/category/category.service';
import { CategoryApiService } from '../../services/category/category-api.service';
import { StatusService } from '../../services/status/status.service';
import { StatusApiService } from '../../services/status/status-api.service';
import { FundService } from '../../services/fund/fund.service';
import { FundApiService } from '../../services/fund/fund-api.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { LocationService } from '../../services/location/location.service';
import { LocationApiService } from '../../services/location/location-api.service';
import { Location } from '../../models/location.model';

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
  private fundService = inject(FundService);
  private fundApiService = inject(FundApiService);
  private locationService = inject(LocationService);
  private locationApiService = inject(LocationApiService);

  ngOnInit(): void {
    this.inventoryService.setIsLoading(true);

    const categories = this.validationService.isEmpty(
      this.categoryService.getAll()
    );
    const statuses = this.validationService.isEmpty(
      this.statusService.getAll()
    );
    const funds = this.validationService.isEmpty(this.fundService.getAll());
    const locations = this.validationService.isEmpty(
      this.locationService.getAll()
    );
    const operations$: Observable<
      Category[] | Status[] | Fund[] | Location[]
    >[] = [];

    if (categories) operations$.push(this.categoryApiService.getAll());
    if (statuses) operations$.push(this.statusApiService.getAll());
    if (funds) operations$.push(this.fundApiService.getAll());
    if (locations) operations$.push(this.locationApiService.getAll());

    if (!this.validationService.isEmpty(operations$))
      forkJoin(operations$).subscribe(() =>
        this.inventoryService.setIsLoading(false)
      );
    else this.inventoryService.setIsLoading(false);
  }
}
