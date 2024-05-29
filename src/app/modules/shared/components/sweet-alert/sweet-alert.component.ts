import { Component, OnInit, inject, input, output } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ThemeService } from '../../services/theme.service';

export interface SweetAlertInterface {
  alert(title: string): void;
}

@Component({
  selector: 'app-sweet-alert',
  templateUrl: './sweet-alert.component.html',
  styleUrl: './sweet-alert.component.scss',
})
export class SweetAlertComponent implements OnInit, SweetAlertInterface {
  private themeService = inject(ThemeService);

  title: string;
  color: string;
  backgroundColor: string;
  iconColor: string;
  confirmButtonColor: string;
  cancelButtonColor: string;

  icon = input<SweetAlertIcon>();
  confirm = output<boolean>();

  ngOnInit(): void {
    this.themeService.onListener().subscribe((theme) => this.setTheme(theme));
  }

  alert(title: string) {
    this.title = this.color + title + '</span>';

    Swal.fire({
      title: this.title,
      icon: this.icon(),
      showCancelButton: true,
      background: this.backgroundColor,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onConfirm();
        return;
      }
      this.onCancle();
    });
  }

  onConfirm() {
    this.confirm.emit(true);
  }

  onCancle() {
    this.confirm.emit(false);
  }

  private setTheme(theme: boolean): void {
    if (theme) {
      this.color = '<span style="color: #fff;">';
      this.backgroundColor = '#19191A';
      this.confirmButtonColor = '#645CCA';
      this.cancelButtonColor = '#636C74';
      return;
    }

    this.color = '<span style="color: #545454;">';
    this.backgroundColor = '#FFFFFF';
    this.confirmButtonColor = '#645CCA';
    this.cancelButtonColor = '#636C74';
  }
}
