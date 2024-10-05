/* Interfaccia per il modello dati del panel*/
export interface Panel {
  /* La classe css contenente il backdrop */
  backdropClass: string;
  /** La classe css contenente il panel*/
  panelClass: string;
  /* Il tipo del panel da visualizzare: panel | subpanel */
  type: string;
  /* Lista delle componenti da visualizzare */
  components: any[];
  /** La componente per l'intestazione*/
  headComponent?: any;
}
