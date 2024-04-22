import { Component, OnInit, inject } from '@angular/core';
import { LogService } from '../../../services/log/log.service';
import { LogApiService } from '../../../services/log/log-api.service';
import { environment } from '../../../../../../environments/environment.development';
import { Log } from '../../../models/log.model';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrl: './log-view.component.scss',
})
export class LogViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private logService = inject(LogService);
  private logApiService = inject(LogApiService);

  imageUrl: string = environment.imageUrl;

  title: string = 'รายละเอียด';
  isLoading: boolean = false;
  id: number = +this.route.snapshot.params['id'];
  log: Log = this.logService.getLogById(this.id);

  ngOnInit(): void {
    if (!this.log) {
      this.isLoading = true;
      this.logApiService
        .getLogById(this.id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => res && (this.log = res));
    }
  }

  isEmpty(value: any): string | any {
    if (!value) return '-';
    return value;
  }

  displayModifyQuantity(modifyQuantity: number): string {
    if (modifyQuantity === 0) return '-';
    if (modifyQuantity < 0) return '-' + modifyQuantity.toString();

    return modifyQuantity.toString();
  }
}
