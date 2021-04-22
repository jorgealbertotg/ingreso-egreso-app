import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombreUsuario: string;
  nombreSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {

  }

  ngOnInit(): void {
    this.nombreSubscription = this.store.select('auth')
      .pipe(
        filter(({user}) => user != null)
      )
      .subscribe(({user}) => {
        this.nombreUsuario = user.nombre;
      });
  }

  ngOnDestroy(): void {
    this.nombreSubscription.unsubscribe();
  }

  cerrarSesion() {
    this.authService.cerrarSesion()
      .then(respuesta => {
        console.log(respuesta);
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error(error)
      });
  }

}
