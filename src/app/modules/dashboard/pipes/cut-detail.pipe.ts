import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutDetail',
})
export class CutDetailPipe implements PipeTransform {
  transform(value: string): string {
    const maxLength = 75;

    if (value.length < maxLength) return value;

    const shortened = value.slice(0, maxLength);
    const lastSpaceIndex = shortened.lastIndexOf(' ');
    return shortened.slice(0, lastSpaceIndex) + ' ...';
  }
}
