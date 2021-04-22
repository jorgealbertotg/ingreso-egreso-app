import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;
    const {tipo, descripcion, monto} = ingresoEgreso;

    return this.firestore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({tipo, descripcion, monto});
  }

  borrarIngresoEgreso(uid: string) {
    const id = this.authService.user.uid;
    return this.firestore.doc(`${id}/ingresos-egresos/items/${uid}`).delete();
  }

  initIngresosEgresosListener(uid: string) {
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc=> ({
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            })
          )
        )
      );
  }
}
