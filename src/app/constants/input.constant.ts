/** Costante per la label degli input */
export const INPUT_CONSTANT = {
  tipologia: 'Tipologia',
  nome: 'Nome',
  id: 'Id',
  azioni_di_gruppo: '+ Azioni',
};

/** Costante per le lable delle head cell della tabella */
export const TABLE_INPUT_CONSTANT = {
  nome: 'NOME',
};

/** Costante contenente tutte le colonne delle generic table */
export const TABLE_COLUMNS = {
  gestori: [
    'nome',
    'telefono',
    'mail',
    'ruolo',
    'ultima_connessione',
    'action',
  ],
};

/** Costante con i testi da usare nella select della azioni di gruppo */
export const TABLE_GROUP_ACTIONS_CONSTANT = [
  {
    value: 'Elimina',
  },
];

/** Costante contenente le impostazioni default della paginazione */
export const TABLE_CONSTANT = {
  pageSize: 20,
  pageNumber: 0,
};
