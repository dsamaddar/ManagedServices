import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { allowedDomainValidator } from '../../../validators/email-domain.validator';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email,allowedDomainValidator(['akijventure.com','adhunikpaper.com','akijagro.net','akijbicycle.com','akijdairy.net','akijee.com','akijfairvalue.com','akijfisheries.com','akijfoodltd.onmicrosoft.com','akijhealthcare.com','akijmdf.com','akijmonowaratrust.net','akijppl.net','akijtakafullife.com.bd','akijvg.net','ampublication.com','atlplc.com','cheesepuffsbd.com','clemonlakhpoti.com','clemonsportsbd.com','fairvalueltd.com','farmfreshbd.net','frutikapurelakhpoti.com','sazmintraders.com','sazmintrading.com','speedlakhpoti.com','wesupportpalestine.net','neoscoder.com', 'akijfood.com'])]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      // Mark all controls as touched so validation errors appear
      Object.values(this.registerForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        // Handle successful registration (e.g., navigate to login)
        ToastrUtils.showToast('Registration Successful.');
        this.loading = false;
        // Redirect to login or dashboard
        this.router.navigateByUrl('login');
      },
      error: (error) => {
        ToastrUtils.showErrorToast('Registration failed. Please try again.');
        this.error = 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
