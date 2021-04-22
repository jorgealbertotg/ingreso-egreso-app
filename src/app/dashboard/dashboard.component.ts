import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { setItems } from '../ingreso-egreso/estadistica/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  ingresosSubscription: Subscription;

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.subscription = this.store.select('auth')
      .pipe(
        filter(auth => auth.user !== null)
      )
      .subscribe(({user}) => {
        console.log(user);
        this.ingresosSubscription = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
          .subscribe(ingresosEgresosFB => {
            console.log(ingresosEgresosFB);
            this.store.dispatch(setItems({items: ingresosEgresosFB}));
          });
      });
  }

  ngOnDestroy(): void {
    this.ingresosSubscription?.unsubscribe();
    this.subscription?.unsubscribe();
  }
}
