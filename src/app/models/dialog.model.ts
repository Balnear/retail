import { ComponentType } from "@angular/cdk/portal";
import { FormGroup } from "@angular/forms";

/** Modello per il titolo e sottotitolo della modale a step */
export interface HeaderLabel {
  title: string;
  subtitle: string;
}

/** Interfaccia per la modale di tipo semplice*/
export interface SimpleModalModel {
  /** Il titolo della modale */
  titolo: string;
  /** Il sottotitolo della modale */
  subtitle: string;
  /** L'icona nella modale */
  icona: string;
  /** Il tipo di icona */
  tipo: string;
  /** Lo status dell'icona */
  status: string;
  /** La dimensione della modale */
  dimension: string;
  /** Eventuale classe da aggiungere alla modale */
  class?: string;
  /** Tempo in millisecondi dopo il quale la modale deve chiudersi da sola. Se non presente la modale non si chiude da sola */
  autoCloseTime?: number;
}

/** Interfaccia per la modale di tipo conferma azione*/
export interface ConfirmData {
  /** Il titolo della modale */
  title: string;
  /** Il sottotitolo della modale */
  subtitle: string;
  /** Il testo del button */
  buttonText: string;
  /** Il tipo di button 'warn' || 'orange' || 'primary'*/
  buttonType: string; 
  /** La dimensione della modale 'sm' || 'lg'*/
  dimension: string; 
  /** Eventuale redirect */
  redirect?: any;
}


export interface GenericFormInterface  {
  form: FormGroup,
  component: ComponentType<any>,
  headerLabels: HeaderLabel,
  submitFormText: string,
  callback: any,
}
