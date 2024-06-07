import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiDate',
})
export class ThaiDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date): string | null {
    if (!value) return null;

    const dateStr = this.datePipe.transform(value, 'd/M/yyyy HH:mm:ss');
    if (!dateStr) return null;

    const [datePart, timePart] = dateStr.split(' ');
    const [d, m, y] = datePart.split('/');
    const buddhistYear = +y + 543;

    return `${d}/${m}/${buddhistYear} ${timePart}`;
  }
}
