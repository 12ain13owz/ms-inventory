import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  constructor(private toastr: ToastrService) {}

  private toastOptions: Partial<IndividualConfig> = {
    closeButton: true,
    timeOut: 3000,
    progressBar: true,
    newestOnTop: true,
    progressAnimation: 'increasing',
    positionClass: 'toast-bottom-right',
    tapToDismiss: true,
  };

  error(title: string, message: string) {
    this.toastr.error(message, title, this.toastOptions);
  }

  info(title: string, message: string) {
    this.toastr.info(message, title, this.toastOptions);
  }

  success(title: string, message: string) {
    this.toastr.success(message, title, this.toastOptions);
  }

  warning(title: string, message: string) {
    this.toastr.warning(message, title, this.toastOptions);
  }
}
