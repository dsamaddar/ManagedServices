import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddPackTypeRequest } from '../models/add-packtype-request.model';
import { Subscription } from 'rxjs';
import { PacktypeService } from '../services/packtype.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrUtils } from '../../../utils/toastr-utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-packtype',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-packtype.component.html',
  styleUrl: './add-packtype.component.css',
})
export class AddPacktypeComponent implements OnDestroy {
  model!: AddPackTypeRequest;
  private addPackTypeSubscription?: Subscription;

  constructor(
    private packTypeService: PacktypeService,
    private router: Router
  ) {
    this.model = {
      userId: '',
      name: '',
      description: '',
    };
  }

  onFormSubmit() {
    this.model.userId = String(localStorage.getItem('user-id'));
    this.addPackTypeSubscription = this.packTypeService
      .addPackType(this.model)
      .subscribe({
        next: (response) => {
          ToastrUtils.showToast('Pack Type Added!');
          this.router.navigateByUrl('/admin/packtype');
        },
        error: (error: HttpErrorResponse) => {
          ToastrUtils.showErrorToast(error.error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.addPackTypeSubscription?.unsubscribe();
  }
}
