import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saveURL'
})
export class SaveURLPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
