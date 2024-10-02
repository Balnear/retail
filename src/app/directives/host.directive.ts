import { Directive, ViewContainerRef } from '@angular/core';

/** Direttiva per ottenere il viewContainerRef */
@Directive({
  selector: '[hostDir]',
  standalone: true,
})
export class HostDirective {
  /**
   * Il costruttore della direttiva
   * @param {ViewContainerRef} viewContainerRef container dove verrÃ  inserito il template
   */
  constructor(public viewContainerRef: ViewContainerRef) {}
}
