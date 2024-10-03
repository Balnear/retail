import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, confirmPasswordReset, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  /** Booleana se il token è in refresh */
  isRefreshingToken: boolean = false;
  /** Booleana se l'utente è loggato */
  isLoggedIn: boolean = false;
  /** L'url della landing page */
  landingUrl!: string;
  /** stato della password se è stato inviata o scaduta o nessun evento */
  tempPasswordStatus: 'default' | 'success' | 'error' = 'default';
  /** Booleana per la verifica dell'email */
  verification: boolean = false;
  /** Nome e Cognome utente in fase di registrazione */
  nomeCognome!: string;
  /** URL dell'immagine del profilo USER  */
  imageURL!: string;
  /** Numero di telefono provvisorio USER  */
  numberPhone!: string;
  /**dati utente */
  datiUser: any;
  /**Dati autenticazione */
  private auth = inject(Auth);

  /**
   * Il costruttore del service
   * @param {PanelService} panelService L'injectable del service PanelService
   * @param {MatDialog} dialog - Injectable del service MatDialog per aprire finestre di dialogo.
   * @param {HttpClient} http L'injectable dell'httpClient
   * @param {Router} router L'injectable del service router per la navigazione tra viste e url
   */
  constructor(
    private router: Router,
  ) {
  }

   /**
   * Effettua l'accesso all'applicazione
   */
  login(email: string, password: string){
    signInWithEmailAndPassword(this.auth,email,password).then((res)=>{
      console.log('accesso eseguito');
      this.router.navigate(['/bo/dashboard']);
      console.log(res,'credenziali');
      
    }).catch((error)=>{
      console.log(error,'errore');
      
    })
  }

  /**Effettua la disconnessione dall'applicazione */
  logout(){
    signOut(this.auth).then((res)=>{
      console.log(res,'utente disconnesso');
      
      this.router.navigate(['/login']);
    }).catch((err)=>{
      console.log(err,'errore disconnessione');
      
    })
  }

  /**Recupero della password */
  recuperaPassword(email: string){

    sendPasswordResetEmail(this.auth, email)
  .then((res) => {
    console.log(res,'email inviata');
    // this.router.navigate(['/reimposta-password']);
    this.router.navigate(['/login']);
    
  })
  .catch((err) => {
    console.log(err,'fallito');
    
  });
  }
}
