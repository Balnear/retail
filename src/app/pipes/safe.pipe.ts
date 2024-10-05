import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';

/** Pipe fare il sanitize di un url */
@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  /**
   * Il costruttore della classe
   * @param {DomSanitizer} sanitizer Sanitizer dell'url
   */
  constructor(protected sanitizer: DomSanitizer) {}

  /**
   * Ritorna l'url sanificato
   * @param {any} value L'url da sanificare
   * @param {string} type Il tipo di url da sanificare
   * @returns {SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl} L'url sanificato
   */
  public transform(
    value: any,
    type: string
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      case 'resourceUrlBase64':
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          `data:image/svg+xml;base64,${value}`
        );
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
