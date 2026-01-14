import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  ngOnInit() {
    if(! this.authService.isAuthenticated()){
      this.toastr.warning("Attualmente non risulti essere autenticato!");
      this.router.navigateByUrl("/");
    } else {
      this.toastr.warning(`Torna presto, ${this.authService.user()}!`, "Sei stato disconnesso");
      this.authService.logout();
      this.router.navigateByUrl("/");
    }
  }
}
