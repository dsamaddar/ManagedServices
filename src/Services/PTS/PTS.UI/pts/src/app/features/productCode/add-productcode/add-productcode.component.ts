import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductCode } from '../models/productcode.model';
import { AddProductCodeRequest } from '../models/add-productcode-request.model';
import { Subscription } from 'rxjs';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { ProductCodeService } from '../services/productcode.service';
import { ToastrUtils } from '../../../utils/toastr-utils';

@Component({
  selector: 'app-add-project',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-productcode.component.html',
  styleUrl: './add-productcode.component.css'
})
export class AddProjectComponent implements OnDestroy {

  model: AddProductCodeRequest;

  private addProjectSubscription?: Subscription;

  constructor(private productCodeService: ProductCodeService, private router: Router){
    this.model = {
      name: '',
      description: '',
      userId: '',
    }
  }

  onFormSubmit(){
    this.model.userId = String(localStorage.getItem('user-id'));
    this.addProjectSubscription = this.productCodeService.addProject(this.model)
    .subscribe({
      next: (response) => {
        ToastrUtils.showToast('Project Added.');
        this.router.navigateByUrl('/admin/projects');
      },
      error: (error) => {
        ToastrUtils.showToast(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.addProjectSubscription?.unsubscribe();
  }
}
