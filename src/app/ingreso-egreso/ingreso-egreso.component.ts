import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { AppState } from '../app.reducer';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string;
  guardando: boolean;
  loadingSubscription: Subscription;

  constructor(private fb: FormBuilder, private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) {
    this.tipo = 'ingreso';
    this.guardando = false;
  }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
    this.loadingSubscription = this.store.select('ui').subscribe(({isLoading}) => {
      this.guardando = isLoading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  guardarIngreso() {
    this.store.dispatch(isLoading());
    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch(error => {
        this.store.dispatch(stopLoading());
        Swal.fire('Error', error.message, 'error');
      }
      );
  }

}
