import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule, CommonModule, RouterModule, SweetAlert2Module],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent implements OnDestroy {
  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.model = {
      name: '',
      description: '',
    };
  }

  showToast(message: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
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
    this.addCategorySubscription = this.categoryService
      .AddCategory(this.model)
      .subscribe({
        next: (response) => {
          this.showToast('Category Added!');
          this.router.navigateByUrl('/admin/categories');
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorToast(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }
}
