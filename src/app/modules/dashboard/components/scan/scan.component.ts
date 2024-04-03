import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss',
})
export class ScanComponent {
  @ViewChild('dateInput') dateInput: ElementRef<HTMLInputElement>;
  @ViewChild('date2') date2: ElementRef<HTMLInputElement>;
  @ViewChild('formDirec') formDirec: FormGroupDirective;

  private fb = inject(FormBuilder);

  datePipe = inject(DatePipe);
  receiveDate: Date;
  form: FormGroup;

  ngOnInit(): void {
    setTimeout(() => {
      this.dateInput.nativeElement.value = '1/1/2567';
    }, 2000);

    this.form = this.fb.nonNullable.group({
      chip: this.fb.group({
        id: [null, [Validators.required]],
        name: ['', [Validators.required]],
      }),
    });

    this.form.controls['chip'].valueChanges.subscribe;
  }

  testDate() {
    console.log(this.dateInput.nativeElement.value);
    console.log(this.receiveDate);
  }

  testChip() {
    console.log(this.form.controls['chip']);

    if (this.chip.value.id === null) {
    }
  }

  testReset() {
    this.formDirec.resetForm();
  }

  get chip() {
    return this.form.controls['chip'];
  }

  onDateInput(event: MatDatepickerInputEvent<Date>) {
    const date = event.value.getDate();
    const month = event.value.getMonth() + 1;
    const year = event.value.getFullYear();
    this.dateInput.nativeElement.value = `${date}/${month}/${year + 543}`;
    this.receiveDate = new Date(`${month}-${date}-${year}`);

    console.log(this.receiveDate);
  }

  onDateFocusOut() {
    const dateInput = this.dateInput.nativeElement.value;
    const dateParts = dateInput.split('/');
    const date = +dateParts[0];
    const month = +dateParts[1] - 1;
    const year = +dateParts[2] - 543;
    this.receiveDate = new Date(year, month, date);

    console.log(this.receiveDate);
  }
}
