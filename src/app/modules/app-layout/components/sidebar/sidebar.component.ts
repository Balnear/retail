import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Subscription } from 'rxjs';

import { AngularMaterialModule } from '../../../material-module';
import { LoginService } from '../../../../services';
import { PAGE_CONSTANT, ICON_CONSTANT } from '../../../../constants';

/** Component per la sidebar dell'applicazione */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('sidebar', [
      state('close', style({ width: '80px' })),
      state('open', style({ width: '260px' })),
      transition('* => *', animate(150)),
    ]),
  ],
})
export class AppSidebarComponent {
  /** Lo state della component */
  state: 'open' | 'close' = 'close';
  /** Booleana per il controllo dello state */
  open: boolean = false;
  /** Andiamo a settare alla variabile pages la constante PAGES importata */
  pages: any[] = [];
  /**Controllo ciclo in presenza di un figlio*/
  treeControl = new NestedTreeControl<any>((node) => node.figlio);
  /** Subscription per le nuove zone create */
  zonaCreationSubscription = new Subscription();

  /**
   * Il costruttore della classe
   * @param {LoginService} loginService L'injectable del service LoginService
   * @param {Router} router Injectable del service Router per la gestione della navigazione tra le pagine
   */
  constructor(public loginService: LoginService, private router: Router) {
    this.setPages();
  }

  /** Dove si inizializza la componente */
  ngOnInit() {}

  /** Dove si distrugge la componente */
  ngOnDestroy() {
    if (this.zonaCreationSubscription)
      this.zonaCreationSubscription.unsubscribe();
  }

  /**
   * Effetta la navigazione alle varie sezioni dell'applicazione
   * @param {string} path  il percorso verso cui navigare
   */
  navigateTo(item: any): void {
    if (item.idZona) {
      this.router.navigate([item.path]);
    } else if (typeof item == 'object') {
      item.active = true;
      this.router.navigate([item.path]);
    } else {
      this.router.navigate([item]);
    }
    this.pages.forEach((page) => (page.showChild = false));
  }

  /**
   * Determina se la pagina corrente è attiva in base al percorso specificato.
   * @param path Il percorso verso cui verificare l'attività
   * @returns true se il percorso specificato corrisponde al percorso della pagina corrente,false in caso contrario.
   */
  isPageActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  /**
   * Determina se la pagina corrente è attiva in base al percorso specificato.
   * @param paths Array di percorsi verso cui verificare l'attività
   * @returns true se il percorso specificato corrisponde al percorso della pagina corrente,false in caso contrario.
   */
  isPageChildActive(paths: string[]): boolean {
    let bool: boolean = false;
    paths.map((p) => {
      if (this.router.url.includes(p)) {
        bool = true;
      }
      return bool;
    });
    return bool;
  }

  /** Setta lo stato della sidebar */
  setSidebarState() {
    if ((this.state = 'open')) {
      this.state = 'close';
      this.pages.forEach((page) => (page.showChild = false));
    } else {
      this.state = 'open';
    }
  }

  /** Setta le pagine da visualizzare in base alle authorities dell'utente */
  setPages() {
    let pages = PAGE_CONSTANT;
    let pageZona = {
      name: 'Dettaglio Zona',
      icon: ICON_CONSTANT.zone,
      showChild: false,
      deniedPermission: ['MAGAZZINIERE', 'AMMINISTRATORE'],
      childPaths: [],
      child: [],
    };

    this.pages = [pages.dashboard, pages.utenti];
  }
}
