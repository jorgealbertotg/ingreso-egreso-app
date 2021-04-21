import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
import { setUser, unsetUser } from '../auth/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firestoreSubscription: Subscription;

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore, private store: Store<AppState>) { }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
            .then(({user}) => {
              const usuario = new Usuario(user.uid, nombre, user.email);
              return this.firestore.doc(`${user.uid}/usuario`).set({...usuario});
            });
  }

  iniciarSesion(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  cerrarSesion() {
    return this.auth.signOut();
  }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      console.log(' fuser ',fuser);
      // console.log(fuser?.uid);
      // console.log(fuser?.email);
      
      if (fuser) {
        this.firestoreSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            console.log(fuser, firestoreUser);
            const user = Usuario.fromFirebase(firestoreUser);
            this.store.dispatch(setUser({user}));
          });
      } else {
        if (this.firestoreSubscription) {
          this.firestoreSubscription.unsubscribe();
        }
        console.log('Llamar unset del user');
        this.store.dispatch(unsetUser());
      }
    });
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }
}
