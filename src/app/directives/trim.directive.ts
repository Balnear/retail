import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/** Direttiva che effettua il trim */
@Directive({
  standalone: true,
  selector: '[trim]',
})
export class TrimDirective {
  /** ElementRef dell'input */
  private el!: any;

  /**
   * Il costruttore della direttiva
   * @param {NgControl} ngControl Effettua il bind del FormControl
   * @param {ElementRef} elementRef riferimento all'elemento a cui la direttiva è associata
   */
  constructor(public ngControl: NgControl, private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  /**
   * Listener dell'evento focusout in cui effettua il trim del valore dell'elemento
   * @param {any} target Il target del valore da modificare
   */
  @HostListener('focusout', ['$event.target'])
  onNgModelChange(target: any) {
    let newVal = this.transform(target.value);
    this.el.value = newVal;
    this.el.dispatchEvent(new Event('input'));
  }

  /**
   * Effettua il trim e il replace degli spazi multipli
   * @param {string} value Il valore da trasformare
   * @returns {string} Il valore trasformato
   */
  transform(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }
}
