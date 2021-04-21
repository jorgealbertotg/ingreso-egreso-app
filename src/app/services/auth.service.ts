import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

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
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }
}
