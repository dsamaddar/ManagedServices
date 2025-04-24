import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  email!: string;
  token!: string;
  password!: string;
  submitting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  // reset-password.component.ts
  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.email = this.route.snapshot.queryParamMap.get('email')!;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  onFormSubmit() {
    if (this.resetForm.invalid) return;

    this.submitting = true;

    const body = {
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.value.password
    };

    this.http.post('/api/auth/reset-password', body).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { reset: 'true' } }),
      error: err => {
        this.submitting = false;
        this.errorMessage = err.error || 'Reset failed. Please try again.';
      }
    });
  }
}
