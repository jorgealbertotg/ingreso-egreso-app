import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { isLoading, stopLoading } from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private store: Store<AppState>) {
    this.cargando = false;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }
  
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  iniciarSesion() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(isLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   showConfirmButton: false,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const {correo, password} = this.loginForm.value;
    this.auth.iniciarSesion(correo, password)
      .then(credenciales => {
        // console.log(credenciales);
        // Swal.close();
        this.store.dispatch(stopLoading());
        this.router.navigate(['/']);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        });
      });
  }

}
