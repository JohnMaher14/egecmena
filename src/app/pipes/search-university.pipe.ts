import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUniversity'
})
export class SearchUniversityPipe implements PipeTransform {

  transform(universities:any[] , term:any): any {
    if (term == undefined) {
      return universities;
    }
      return universities.filter(function (universities) {
        console.log(universities);
        return universities.ar_name.toLowerCase().includes(term.toLowerCase()) || universities.en_name.toLowerCase().includes(term.toLowerCase());
      });
  }

}
