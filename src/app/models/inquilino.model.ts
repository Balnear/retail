/** Modello per interfaccia inquilino */
export interface InquilinoProfile {
  /**id del locatore */
  locatoreId: string;
  /**id dell'inquilino */
  uid: string;
  /**Email dell'inquilino */
  email: string;
  /**Nome e cognome dell'inquilino */
  displayName: string;
  /**Tipologia di utente (Selezionabile solo inquilino) */
  userType: 'Locatore' | 'Inquilino';
  /**Data di creazione dell'inquilino */
  createdAt: Date;
  /**Numero di telefono dell'inquilino */
  phoneNumber: string;
  /**Immagine del profilo dell'inquilino */
  photoURL?: string;
  /**Stato di attività */
  status: 'Online' | 'Offline';
}
