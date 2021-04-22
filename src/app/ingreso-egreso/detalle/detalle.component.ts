import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../estadistica/ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[];
  ingresosSubscription: Subscription;

  constructor(private store: Store<AppStateWithIngreso>, private ingresosEgresosService: IngresoEgresoService) {
    this.ingresosEgresos = [];
  }

  ngOnInit(): void {
    this.ingresosSubscription = this.store.select('ingresosEgresos').subscribe(({items}) => {
      this.ingresosEgresos = items;
    });
  }

  ngOnDestroy(): void {
    this.ingresosSubscription.unsubscribe();
  }

  borrar(uid: string) {
    console.log(uid);
    this.ingresosEgresosService.borrarIngresoEgreso(uid)
      .then(() => {
        Swal.fire('Borrado', 'Item borrado', 'success');
      })
      .catch(error => {
        Swal.fire('Error', error.message, 'error');
      });
  }

}
