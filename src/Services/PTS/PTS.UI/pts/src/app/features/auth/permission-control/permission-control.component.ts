import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-permission-control',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './permission-control.component.html',
  styleUrl: './permission-control.component.css'
})
export class PermissionControlComponent {

  form!: FormGroup;
  emails: string[] = [];
  roles: string[] = [];
  userRoles: string[] = [];
  selectEmail!: string;
  selectRole!: string;
 
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });

    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(){
    this.http.get<string[]>(`${environment.apiBaseUrl}/api/auth/users`).subscribe({
      next: (data) => {
        this.emails = data;
        console.log(this.emails);
      },
      error: () => {
        alert('Failed to load users');
      }
    });
  }

  onRoleChange(role: string){
    this.selectRole = role;
    console.log(this.selectRole);
  }

  getUserRoles(email: string) {
    this.http.get<string[]>(`${environment.apiBaseUrl}/api/auth/roles/${email}`).subscribe({
      next: roles => {
        console.log('Assigned roles:', roles);
        this.userRoles = roles;
        this.selectEmail = this.form.get('email')!.value;
      },
      error: err => {
        console.error('Failed to fetch user roles');
      }
    });
  }

  loadRoles() {
    this.http.get<string[]>(`${environment.apiBaseUrl}/api/auth/roles`).subscribe({
      next: (data) => {
        this.roles = data;
        console.log(this.roles);
      },
      error: () => {
        alert('Failed to load roles');
      }
    });
  }

  assignRole() {
    if (this.form.invalid) return;

    this.http.post(`${environment.apiBaseUrl}/api/auth/assign-role`, this.form.value).subscribe({
      next: () => {
        alert('Role assigned successfully.');

        if (this.form.get('email')) {
          this.getUserRoles(this.form.get('email')!.value);
        }
      
      },
      error: err => alert('Failed to assign role.')
    });
  }

  revokeRole() {
    if (this.form.invalid) return;

    this.http.post(`${environment.apiBaseUrl}/api/auth/revoke-role`, {email: this.selectEmail, role: this.selectRole}).subscribe({
      next: () => {
        alert('Role revoked successfully.');

        if (this.form.get('email')) {
          this.getUserRoles(this.form.get('email')!.value);
        }
      
      },
      error: err => alert('Failed to revoke role.')
    });
  }

}
