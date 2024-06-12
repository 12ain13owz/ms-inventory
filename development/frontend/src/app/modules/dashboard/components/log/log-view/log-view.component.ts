import { Component, OnInit, inject } from '@angular/core';
import { LogService } from '../../../services/log/log.service';
import { LogApiService } from '../../../services/log/log-api.service';
import { environment } from '../../../../../../environments/environment';
import { Log } from '../../../models/log.model';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { InventoryService } from '../../../services/inventory/inventory.service';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrl: './log-view.component.scss',
})
export class LogViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private logService = inject(LogService);
  private logApiService = inject(LogApiService);
  private inventoryService = inject(InventoryService);

  imageUrl: string = environment.imageUrl;

  title: string = 'รายละเอียดประว้ติครุภัณฑ์';
  isLoading: boolean = false;
  id: number = +this.route.snapshot.params['id'];
  log: Log = this.logService.getById(this.id);

  ngOnInit(): void {
    if (!this.log) {
      this.isLoading = true;
      this.logApiService
        .getById(this.id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => res && (this.log = res));
    }
  }

  isEmpty(value: any): string | any {
    if (!value) return '-';
    return value;
  }

  getUseDate(receivedDate: string) {
    const date = new Date(receivedDate);
    return this.inventoryService.getUseDate(date);
  }
}
