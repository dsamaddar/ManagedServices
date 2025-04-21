import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  success = '';
  error = '';
  submitted = false;
  forgotForm!: FormGroup;
  

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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

    this.authService.forgotPassword(this.forgotForm.value.email!).subscribe({
      next: () => this.success = 'Check your email for reset instructions.',
      error: () => this.error = 'Unable to send reset instructions.'
    });
  }
}
