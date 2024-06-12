import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiYear',
})
export class ThaiYearPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}/${month + 1}/${year + 543}`;
  }
}
