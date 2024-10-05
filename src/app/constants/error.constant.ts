/** Costante per le label degli errori */
export const ERROR_CONSTANT = {
  email_address: "Inserisci un' email valida",
  password_8_caratteri: 'ALMENO 8 CARATTERI',
  password_1_numero: 'ALMENO 1 NUMERO',
  password_lettera_maiuscola: 'ALMENO 1 LETTERA MAIUSCOLA',
  password_carattere_speciale: 'ALMENO 1 CARATTERE SPECIALE',
  campo_obbligatorio: 'Il campo è obbligatorio',
  campo_non_valido: 'Il campo non è valido',
  numero_massimo:
    'Il numero selezionato supera il numero massimo di campi che puoi generare.',
  estensione_superata:
    "L'estensione inserita non deve superare l'estensione della zona.",
  password_non_corrispondono: 'Le password non corrispondono',
  animation_not_supported: 'Animation not supported for your browser',
};

export const PASSWORD_VALIDATORS = [
  {
    validatorName: 'minlength',
    validatorLabel: 'ALMENO 8 CARATTERI',
  },
  {
    validatorName: 'hasCapitalCase',
    validatorLabel: 'ALMENO 1 LETTERA MAIUSCOLA',
  },
  {
    validatorName: 'hasNumberCase',
    validatorLabel: 'ALMENO UN NUMERO',
  },
  {
    validatorName: 'hasSpecialCharacters',
    validatorLabel: 'ALMENO 1 CARATTERE SPECILALE (!?#@%$)',
  },
];
