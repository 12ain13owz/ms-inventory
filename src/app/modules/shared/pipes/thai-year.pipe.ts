import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaiYear',
})
export class ThaiYearPipe implements PipeTransform {
  transform(value: Date): any {
    const day = value.getDate();
    const month = value.getMonth();
    const year = value.getFullYear();

    return `${day}/${month + 1}/${year + 543}`;
  }
}
