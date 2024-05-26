import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: number[], searchText: string): unknown[] {
    if (!value || !value.length) return value;
    if (!searchText || !searchText.length) return value;
    return value.filter((item) => {
      return (
        item.toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1
      );
    });
  }
}
