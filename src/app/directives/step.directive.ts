import { Directive, ViewContainerRef } from '@angular/core';

/** Direttiva per ottenere il viewContainerRef */
@Directive({
  selector: '[stepHost]',
  standalone: true,
})
export class StepDirective {
  /**
   * Il costruttore della direttiva
   * @param {ViewContainerRef} viewContainerRef container dove verrà inserito il template
   */
  constructor(public viewContainerRef: ViewContainerRef) {}
}
