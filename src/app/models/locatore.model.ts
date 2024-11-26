/** Modello per interfaccia locatore */
export interface LocatoreProfile {
  /**id del locatore */
  uid: string;
  /**Email del locatore */
  email: string;
  /**Nome e cognome del locatore */
  displayName: string;
  /**Tipologia di utente (Selezionabile solo locatore) */
  userType: 'Locatore' | 'Inquilino';
  /**Data di creazione del locatore */
  createdAt: Date;
  /**Numero di telefono del locatore */
  phoneNumber: string;
  /**Immagine del profilo del locatore */
  photoURL?: string;
  /**Stato di attività */
  status: 'Online' | 'Offline';
  /**Id degli inquilini associati */
  inquilini?: string[];
}
