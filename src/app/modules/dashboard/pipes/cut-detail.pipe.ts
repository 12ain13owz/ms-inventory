import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutDetail',
})
export class CutDetailPipe implements PipeTransform {
  transform(value: string): string {
    const maxLength = 50; // ยาวสุดที่ต้องการ
    const shortened = value.slice(0, maxLength);
    const lastSpaceIndex = shortened.lastIndexOf(' ');
    return shortened.slice(0, lastSpaceIndex);
  }
}
