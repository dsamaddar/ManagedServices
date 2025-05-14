import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { ToastrUtils } from '../../../utils/toastr-utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  show_internal_id = false;

  id?: number = 0;
  paramsSubscription?: Subscription;
  editCategorySubscription?: Subscription;
  deleteCategorySubscription?: Subscription;
  category?: Category;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if (this.id) {
          // get the data from the api for this category id
          this.categoryService.getCategoryById(this.id).subscribe({
            next: (response) => {
              this.category = response;
            },
          });
        }
      },
    });
  }

  onFormSubmit(): void {
    const updateCategoryRequest: UpdateCategoryRequest = {
      userid: this.category?.userId ?? '',
      name: this.category?.name ?? '',
      description: this.category?.description ?? '',
    };

    // pass this object to service
    if (this.id) {
      this.editCategorySubscription = this.categoryService
        .updateCategory(this.id, updateCategoryRequest)
        .subscribe({
          next: (response) => {
            ToastrUtils.showToast('Category Updated.');
            this.router.navigateByUrl('/admin/categories');
          },
          error: (error) => {
            ToastrUtils.showErrorToast(error);
          },
        });
    }
  }

  onDelete(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ Call your delete logic here
        if (this.id) {
          this.deleteCategorySubscription = this.categoryService
            .deleteCategory(this.id)
            .subscribe({
              next: (response) => {
                this.router.navigateByUrl('/admin/categories');
              },
            });
        }
      } else {
        console.log('Delete operation cancelled.');
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
    this.deleteCategorySubscription?.unsubscribe();
  }
}
