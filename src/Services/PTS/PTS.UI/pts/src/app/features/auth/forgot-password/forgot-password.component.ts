import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  success = '';
  error = '';
  submitted = false;
  forgotForm!: FormGroup;

  emailSent: boolean = false;
  countdown: number = 15;
  private intervalId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      // Mark all controls as touched so validation errors appear
      Object.values(this.forgotForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    // Show countdown message and start countdown immediately
    this.emailSent = true;
    this.success = 'Sending reset instructions...';
    this.startCountdown();

    this.authService
      .forgotPassword(
        this.forgotForm.value.email!,
        environment.resetPasswordClientURI
      )
      .subscribe({
        next: (response) => {
          this.success = 'Check your email for reset instructions.';
        },
        error: (error) => {
          console.log(error);
          this.error = 'Unable to send reset instructions.';
          //ToastrUtils.showErrorToast(this.error);
        },
      });
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/login']); // Navigate to login after countdown
      }
    }, 1000);
  }
}
