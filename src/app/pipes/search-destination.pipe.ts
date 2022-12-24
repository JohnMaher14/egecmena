import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDestination'
})
export class SearchDestinationPipe implements PipeTransform {

  transform(destination:any[] , term:any): any {
    if (term == undefined) {

      return destination;
    }

    return destination.filter(function (destination) {

        return destination.ar_name.toLowerCase().includes(term.toLowerCase()) || destination.en_name.toLowerCase().includes(term.toLowerCase());
      });
  }

}
