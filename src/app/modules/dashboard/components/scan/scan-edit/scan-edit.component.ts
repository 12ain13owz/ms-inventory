import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Inventory } from '../../../models/inventory.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { InventoryCheckApiService } from '../../../services/inventory-check/inventory-check-api.service';
import { ToastNotificationService } from '../../../../../core/services/toast-notification.service';
import { INVENTORY } from '../../../constants/inventory.constant';
import { environment } from '../../../../../../environments/environment';
import { StatusService } from '../../../services/status/status.service';
import { Subscription, finalize } from 'rxjs';
import { InventoryCheckPayload } from '../../../models/inventory-check';

@Component({
  selector: 'app-scan-edit',
  templateUrl: './scan-edit.component.html',
  styleUrl: './scan-edit.component.scss',
})
export class ScanEditComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private statusService = inject(StatusService);
  private inventoryCheckApiService = inject(InventoryCheckApiService);
  private toastService = inject(ToastNotificationService);

  private subscription = new Subscription();
  dialogRef = inject(MatDialogRef<ScanEditComponent>);
  inventory: Inventory = inject(MAT_DIALOG_DATA);
  imageUrl: string = environment.imageUrl;
  statuses = this.statusService.getActiveDetails();

  validationField = INVENTORY.validationField;
  title: string = 'ตรวจสอบครุภัณฑ์';
  isLoading: boolean = false;
  form = this.initForm();

  ngOnInit(): void {
    if (this.inventory)
      this.form.setValue({ status: this.inventory.Status.id });
    else {
      this.toastService.error('Error', 'ไม่พบข้อมูลครุภัณฑ์');
      this.dialogRef.close();
    }

    this.dialogRef
      .keydownEvents()
      .subscribe((event) => event.key === 'Escape' && this.dialogRef.close());

    this.subscription = this.statusService
      .onListener()
      .subscribe(() => (this.statuses = this.statusService.getActiveDetails()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const status = this.statuses.find(
      (status) => status.id === this.status.value
    );
    const statusName = status ? status.name : '';
    const payload: InventoryCheckPayload = {
      inventoryId: this.inventory.id,
      statusId: this.status.value,
      statusName: statusName,
    };

    this.isLoading = true;
    this.inventoryCheckApiService
      .create(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res) => {
        this.toastService.success('Success', res.message, 1500);
        this.dialogRef.close();
      });
  }

  onReset(): void {
    this.form.setValue({ status: this.inventory.Status.id });
  }

  onSelectChip(keyName: string): void {
    this[keyName].markAsTouched();
  }

  get status(): FormControl<number> {
    return this.form.controls['status'];
  }

  private initForm() {
    return this.formBuilder.group({
      status: this.formBuilder.control<number>(null, [Validators.required]),
    });
  }
}
