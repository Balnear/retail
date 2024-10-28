import { ICON_CONSTANT } from './icon.constant';

/** Dichiarazione di un array di oggetti 'pages', dove ogni oggetto rappresenta una voce di menu */
export const PAGE_CONSTANT = {
  dashboard: {
    name: 'Dashboard',
    icon: ICON_CONSTANT.dashboard,
    path: 'bo/dashboard',
    deniedPermission: ['AMMINISTRATORE', 'MAGAZZINIERE'],
  },
  utenti: {
    name: 'Utenti',
    icon: 'supervisor_account',
    childPaths: ['bo/locatori', 'bo/inquilini'],
    showChild: false,
    deniedPermission: ['MAGAZZINIERE', 'AMMINISTRATORE'],
    child: [
      {
        name: 'Locatori',
        path: 'bo/locatori',
      },
      {
        name: 'Inquilini',
        path: 'bo/inquilini',
      },
    ],
  },
  case: {
    name: 'Case',
    icon: 'apartment',
    childPaths: ['bo/assegna-casa'],
    showChild: false,
    deniedPermission: ['MAGAZZINIERE', 'AMMINISTRATORE'],
    child: [
      {
        name: 'Assegna casa',
        path: 'bo/assegna-casa',
      },
    ],
  },

  // colture: {
  //   name: 'Colture',
  //   icon: ICON_CONSTANT.colture,
  //   path: 'bo/colture',
  //   showChild: false,
  //   deniedPermission: ['MAGAZZINIERE', 'AMMINISTRATORE'],
  // },
  // magazzino: {
  //   name: 'Magazzino',
  //   icon: 'warehouse',
  //   childPaths: [
  //     'bo/magazzino',
  //     'bo/sensori/gestione-sensori',
  //     '/bo/sensore/giacenza',
  //     '/bo/sensori/assegnazioni',
  //     '/bo/sensore/assegnati',
  //   ],
  //   showChild: false,
  //   deniedPermission: ['RESPONSABILE'],
  //   child: [
  //     {
  //       name: 'Tutti i magazzini',
  //       path: 'bo/magazzino',
  //     },
  //     {
  //       name: 'Tutti i sensori',
  //       path: 'bo/sensori/gestione-sensori',
  //     },
  //   ],
  // },
};

/**
 * Oggetto con chiave-valore uguale un path come chiave e valore oggetto di tipo { title: title, subtitle: subtile}
 * Costante in cui sono presenti in base al path in cui si è i valori del titolo e il sottotitolo da mostrare nella sezione del sub header
 */
export const DASHBOARD_HEADER = {
  '/bo/dashboard': {
    title: 'Dashboard',
  },
  '/bo/locatori': {
    title: 'Locatori',
  },
  '/bo/inquilini': {
    title: 'Inquilini',
  },
  '/bo/assegna-casa': {
    title: 'Assegna casa',
  },
};

export const BREADCRUBS_HEADER = {
  '/bo/dashboard': {
    title: 'DASHBOARD',
  },
  '/bo/locatori': {
    title: 'bo >',
    subTitle: '  Locatori',
  },
  '/bo/inquilini': {
    title: 'bo >',
    subTitle: '  Inquilini',
  },
  '/bo/assegna-casa': {
    title: 'bo >',
    subTitle: '  Assegna casa',
  },
};
