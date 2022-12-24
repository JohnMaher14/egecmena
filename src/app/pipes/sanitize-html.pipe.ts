import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private _DomSanitizer:DomSanitizer) {
  }

  transform(data:string):SafeHtml {
    return this._DomSanitizer.bypassSecurityTrustHtml(data);
  }

}
