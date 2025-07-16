import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../_services/rest-api/api.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(ApiService);
  submitted = false;
  signupForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required, 
      Validators.minLength(4)])
  });

  handleSignup() {
    this.submitted = true;
    if(this.signupForm.invalid){
      this.toastr.error("I dati forniti non sono validi!", "Oops! Dati non validi!");
    } else {
      this.restService.signup({
        usr: this.signupForm.value.user as string,
        pwd: this.signupForm.value.pass as string,
      }).subscribe({
        error: (err) => {
          this.toastr.error("L'username selezionato già esiste!", "Oops! Non è possibile creare un nuovo utente");
        },
        complete: () => {
          this.toastr.success(`Adesso puoi effettuare il login`,`Congratulazioni ${this.signupForm.value.user}!`);
          this.router.navigateByUrl("/signin");
        }
      })
    }
  }
}
