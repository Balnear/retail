import { ICON_CONSTANT } from './icon.constant';

/** Dichiarazione di un array di oggetti 'pages', dove ogni oggetto rappresenta una voce di menu */
export const PAGE_CONSTANT = {
  dashboard: {
    name: 'Dashboard',
    icon: ICON_CONSTANT.dashboard,
    path: 'bo/dashboard',
    deniedPermission: ['AMMINISTRATORE', 'MAGAZZINIERE'],
  },
  // utenti: {
  //   name: 'Utenti',
  //   icon: 'supervisor_account',
  //   childPaths: ['bo/gestori', 'bo/coltivatori'],
  //   showChild: false,
  //   deniedPermission: ['MAGAZZINIERE', 'AMMINISTRATORE'],
  //   child: [
  //     {
  //       name: 'Gestori',
  //       path: 'bo/gestori',
  //     },
  //     {
  //       name: 'Coltivatori',
  //       path: 'bo/coltivatori',
  //     },
  //     {
  //       name: 'Grower',
  //       path: 'bo/grower',
  //     },
  //   ],
  // },
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
};

export const BREADCRUBS_HEADER = {
  '/bo/dashboard': {
    title: 'DASHBOARD',
  },
};
