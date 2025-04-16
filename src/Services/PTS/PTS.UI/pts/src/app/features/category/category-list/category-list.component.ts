import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  imports: [RouterModule, CommonModule, MatSnackBarModule, SweetAlert2Module],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  // observable array
  categories$?: Observable<Category[]>;
  private listCategorySubscription?: Subscription;

  constructor(private categorySerivce: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,  // duration in ms
      horizontalPosition: 'center', // Horizontal position
      verticalPosition: 'bottom',   // Vertical position
      panelClass: ['snackbar-success']  // Custom CSS classes
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error']

    });
  }

  showToast(message: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  showErrorToast(message: string) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  ngOnInit(): void {
    this.categories$ = this.categorySerivce.getAllCategories().pipe(
      catchError(error => {
        /*
        this.toastr.error('Failed to load categories', 'Oops!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
          positionClass: 'toast-top-right',
          enableHtml: true
        });
        */
        //this.showErrorMessage('Failed to load categories');
        this.showToast('Failed to load categories');
        
        // return empty array so UI doesn't break
        return of([]);
      })
    );
     
    
  }

}
