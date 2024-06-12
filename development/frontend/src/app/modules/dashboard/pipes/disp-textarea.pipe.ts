import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dispTextarea',
})
export class DispTextareaPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '-';

    const lines = value.split('\n');
    const content = lines.map((line) => `<p>${line}</p>`).join('');
    return content.replace(/['"]+/g, '');
  }
}
