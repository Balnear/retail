import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breadcrumbs',
  standalone: true,
  pure: false,
})
export class BreadcrumbsPipe implements PipeTransform {
  /**
   * Ritorna il titolo della pagina usando il path o una string vuota se non trovato
   * @param {string} value Non usato ma necessario per l'interfaccia
   * @param {any} array L'Array da usare per recupare la string da usare nel titolo
   * @param {string} key La chiave da usare nell'Array
   * @returns {string} Il titolo
   */
  transform(value: string, array: any, key: string): string {
    let title: string | null = null;
    let subTitle: string | null = null;
    title = array[location.pathname][key];
    subTitle = array[location.pathname][key];

    return title ? title ?? '' : '' && subTitle ? subTitle ?? '' : '';
  }
}
