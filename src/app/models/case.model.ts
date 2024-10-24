/** Modello per interfaccia case */
export interface Casa {
  /**id casa */
  id: string;
  /**nome della casa (monolocale, bilocale ecc') */
  nome: string;
  /**tipologia della casa (casa al mare, casa in montagna ecc) */
  tipologiaCasa: string;
  /**indirizzo della casa */
  indirizzo: string;
  /**citta' della casa */
  citta: string;
  /**codice postale */
  codicePostale: string;
  /**stato dell'affitto (libera-occupata-in scadenza) */
  statoAffitto: string;
  /**stato di manutenzione (buono-da ristrutturare-nuovo) */
  statoManutenzione: string;
  /**data inserimento */
  dataInserimento: Date;
  /**arredamento casa */
  arredamento: boolean;
  /**documento arredamento */
  documentoArredamento: File | null;
  /**casa assegnata */
  assegnaCasa: AssociaCasa[];
  /**locatore della casa */
  locatore: {
    id: string;
    displayName: string;
    phoneNumber: string;
  };
  /**caratteristiche */
  caratteristiche: CaratteristicheCasa;
  /**costi */
  costi: CostiCasa;
}

/**Caratteristiche della casa */
export interface CaratteristicheCasa {
  /**dimensione della casa */
  dimensione: string;
  /**numero delle camere */
  camere: string;
  /**numero bagni */
  bagni: string;
  /**assegnazione piano (piano terra-primo-secondo-terzo) */
  piano: string;
  /**disponibilita' giardino */
  giardino: boolean;
  /**posto auto (si o no) */
  postoAuto: boolean;
  /**aria condizionata (si o no) */
  ariaCondizionata: boolean;
  /**tipo di riscaldamento (autonomo-centralizzato) */
  tipoRiscaldamento: string;
}

/**Costi della casa */
export interface CostiCasa {
  /**importo affito (mensile: 2000) */
  importoAffittoMensile: string;
  /**data inizio contratto */
  dataInizioContratto: Date;
  /**data cessione contratto */
  dataFineContratto: Date;
  /**durata del contratto (settimana o mese) */
  durataContratto: string;
  /**importo del contratto */
  importoContratto: string;
  /**metodo di pagamento (online, contanti) */
  metodoPagamento: string;
}

/**Associazione casa a inquilino */
export interface AssociaCasa {
  /**dettaglio della casa associata */
  informazioniCasa: Casa;
  /**inquilino della casa */
  inquilino: {
    id: string;
    displayName: string;
    email: string;
    phoneNumber: string;
  };
  /**pagamento effettuato (si o no)
   * visualizzare tramite una chip (pagato o non pagato)
   */
  pagato: boolean;
}
