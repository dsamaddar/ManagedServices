import { Component } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model: LoginRequest;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.model = {
      email: '',
      password: '',
    };
  }

  showErrorToast(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error('Server-side error:');
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      console.error('Error body:', error.error);

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error ${error.status}`,
        text: error.error?.message || 'ERR_CONNECTION_REFUSED',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  onFormSubmit() {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        // set auth cookie
        this.cookieService.set(
          'Authorization',
          `Bearer ${response.token}`,
          undefined,
          '/',
          undefined,
          true,
          'Strict'
        );

        console.log(response);

        // set the user in local storage and emit user values
        this.authService.setUser({
          userid: response.userid,
          email: response.email,
          roles: response.roles
        });

        // Redirect back to Home Page
        this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        this.showErrorToast(error);
      },
    });
  }
}
