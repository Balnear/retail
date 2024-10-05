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
}

/** Modello per nominativoUser */
export interface profiloUser {
  /**Identificatore univoco dell'utente */
  uid: string;
  /**Email dell'utente */
  email: string;
  /**Nome visualizzato */
  displayName?: string;
  /**URL della foto del profilo */
  photoURL?: string;
}
