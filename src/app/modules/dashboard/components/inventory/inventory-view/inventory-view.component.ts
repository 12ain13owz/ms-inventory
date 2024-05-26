import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { InventoryService } from '../../../services/inventory/inventory.service';
import { InventoryApiService } from '../../../services/inventory/inventory-api.service';
import { PrintService } from '../../../services/print/print.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Platform } from '@angular/cdk/platform';
import { environment } from '../../../../../../environments/environment';
import { Inventory, InventoryPrint } from '../../../models/inventory.model';

@Component({
  selector: 'app-inventory-view',
  templateUrl: './inventory-view.component.html',
  styleUrl: './inventory-view.component.scss',
})
export class InventoryViewComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private route = inject(ActivatedRoute);
  private inventoryService = inject(InventoryService);
  private inventoryApiService = inject(InventoryApiService);
  private printService = inject(PrintService);
  private snackBar = inject(MatSnackBar);
  private platfrom = inject(Platform);

  imageUrl: string = environment.imageUrl;

  title: string = 'รายละเอียด ครุภัณฑ์';
  isEdit: boolean = false;
  isLoading: boolean = false;
  id: number = +this.route.snapshot.params['id'];
  inventory: Inventory = this.inventoryService.getInventoryById(this.id);

  ngOnInit(): void {
    if (!this.inventory) {
      this.isLoading = true;
      this.inventoryApiService
        .getInventoryById(this.id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => res && (this.inventory = res));
    }

    this.subscription = this.inventoryService
      .onInventoriesListener()
      .subscribe(
        () => (this.inventory = this.inventoryService.getInventoryById(this.id))
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUseDate(receivedDate: Date) {
    const date = new Date(receivedDate);
    return this.inventoryService.getUseDate(date);
  }

  isEmpty(value: any): string | any {
    if (!value) return '-';
    return value;
  }

  onEdit() {
    this.isEdit = true;
  }

  onEditSuccess(inventory: Inventory) {
    this.isEdit = false;
    this.inventory = inventory;
  }

  onPrint(): void {
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

    const inventory: InventoryPrint = {
      id: this.inventory.id,
      track: this.inventory.track,
      image: this.inventory.image,
      code: this.inventory.code,
      description: this.inventory.description,
      printCount: 1,
    };
    this.printService.createInventory(inventory);
  }
}
