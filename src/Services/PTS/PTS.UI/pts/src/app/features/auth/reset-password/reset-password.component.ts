import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrUtils } from '../../../utils/toastr-utils';

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
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }

  // reset-password.component.ts
  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    this.email = this.route.snapshot.queryParamMap.get('email')!;

    console.log(this.email);
    console.log(this.token);
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onFormSubmit() {
    if (this.resetForm.invalid) {
      alert('Invalid');
      return;
    }

    this.submitting = true;

    const body = {
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.value.password,
    };

    this.authService
      .resetPassword(body.email, body.token, body.newPassword)
      .subscribe({
        next: (response) => {
          console.log(response);
          ToastrUtils.showToast('Password Reset Was Successful');
          this.router.navigate(['/login'], { queryParams: { reset: 'true' } });
        },
        error: (err) => {
          console.log(Response);
          this.submitting = false;
          this.errorMessage = err.error || 'Reset failed. Please try again.';
        },
      });

    /*
    this.http.post('/api/auth/reset-password', body).subscribe({
      
    });
    */
  }
}
