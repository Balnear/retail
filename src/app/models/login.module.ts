/** Modello per interfaccia utente */
export interface User {
  /**Identificatore univoco dell'utente */
  uid: string;
  /**Email dell'utente */
  email: string;
  /**Nome visualizzato */
  displayName?: string;
  /**URL della foto del profilo */
  photoURL?: string;
  /**Flag che indica se l'email è verificata */
  emailVerified: boolean;
  /**Tipologia di utente */
  userType: 'Locatore' | 'Inquilino';
  /**Numero di telefono */
  phoneNumber: string;
  /**Stato di attività */
  status: 'Online' | 'Offline';
  /**Id degli inquilini associati */
  inquilini?: string[];
}

/** Modello per nominativoUser */
export interface profiloUser {
  /**Identificatore univoco dell'utente */
  uid: string;
  /**Email dell'utente */
  email: string;
  /**Nome visualizzato */
  displayName: string;
  /**URL della foto del profilo */
  photoURL?: string;
  /**Tipologia di utente */
  userType: 'Locatore' | 'Inquilino';
  /**Numero di telefono */
  phoneNumber: string;
  /**Stato di attività */
  status: 'Online' | 'Offline';
}
