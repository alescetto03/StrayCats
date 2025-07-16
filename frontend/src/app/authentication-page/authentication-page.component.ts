import { Component, inject } from '@angular/core';
import { ApiService } from '../_services/rest-api/api.service';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.css'
})
export class AuthenticationPageComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(ApiService);
  authService = inject(AuthService);
  submitted = false;
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required, 
      Validators.minLength(4)])
  })

  handleLogin() {
    this.submitted = true;
    if(this.loginForm.invalid){
      this.toastr.error("I dati forniti non sono validi!", "Oops! Dati non validi!");
    } else {
      this.restService.login({
        usr: this.loginForm.value.user as string,
        pwd: this.loginForm.value.pass as string,
      }).subscribe({
        next: (token) => {
          this.authService.updateToken(token);
        },
        error: (err) => {
          this.toastr.error("Per favore, inserisci un username e una password valide", "Oops! Credenziali non valide");
        },
        complete: () => {
          this.toastr.success(`Hai effettuato con successo il login!`,`Benvenuto ${this.loginForm.value.user}!`);
          this.router.navigateByUrl("/");
          console.log(this.authService.getUser());
        }
      })
    }
  }
}
