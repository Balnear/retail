import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
  standalone: true,
})
export class ReplacePipe implements PipeTransform {
  transform(
    value: string,
    searchValue: string | RegExp,
    replaceValue: string
  ): string {
    searchValue = new RegExp(searchValue, 'g');
    return value ? value.replace(searchValue, replaceValue) : value;
  }
}
