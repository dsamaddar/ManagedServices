import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCode } from '../models/productcode.model';
import { ProductCodeService } from '../services/productcode.service';
import { UpdateProductCodeRequest } from '../models/update-productcode-request.model';
import { ToastrUtils } from '../../../utils/toastr-utils';

@Component({
  selector: 'app-edit-productcode',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-productcode.component.html',
  styleUrl: './edit-productcode.component.css',
})
export class EditProductCodeComponent implements OnInit, OnDestroy {
  id: number = 0;

  paramsSubscription?: Subscription;
  editProductCodeSubscription?: Subscription;
  deleteProductCodeSubscription?: Subscription;
  project?: ProductCode;

  constructor(
    private route: ActivatedRoute,
    private productCodeService: ProductCodeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if (this.id) {
          // get data from api for this project id
          this.productCodeService.getProjectById(this.id).subscribe({
            next: (response) => {
              this.project = response;
            },
          });
        }
      },
    });
  }

  onFormSubmit(): void {
    const updateProductCodeRequest: UpdateProductCodeRequest = {
      name: this.project?.name ?? '',
      description: this.project?.description ?? '',
      userId: String(localStorage.getItem('user-id')),
    };

    // pass this object to service
    if (this.id) {
      this.editProductCodeSubscription = this.productCodeService
        .updateProject(this.id, updateProductCodeRequest)
        .subscribe({
          next: (response) => {
            ToastrUtils.showToast('Project Updated.');
            this.router.navigateByUrl('/admin/productcodes');
          },
          error: (error) => {
            ToastrUtils.showErrorToast(error);
          },
        });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.deleteProductCodeSubscription = this.productCodeService
        .deleteProject(this.id)
        .subscribe({
          next: (response) => {
            ToastrUtils.showToast('Project Updated.');
            this.router.navigateByUrl('/admin/projects');
          },
          error: (error) => {
            ToastrUtils.showToast(error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editProductCodeSubscription?.unsubscribe();
    this.deleteProductCodeSubscription?.unsubscribe();
  }
}
