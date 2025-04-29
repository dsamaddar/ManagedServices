import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PackType } from '../models/packtype.model';
import { PacktypeService } from '../services/packtype.service';
import { UpdatePackTypeRequest } from '../models/update-packtype-request.model';
import { ToastrUtils } from '../../../utils/toastr-utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-packtype',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './edit-packtype.component.html',
  styleUrl: './edit-packtype.component.css',
})
export class EditPacktypeComponent implements OnInit, OnDestroy {
  show_internal_id = false;

  id?: number = 0;
  paramsSubscription?: Subscription;
  editPackTypeSubscription?: Subscription;
  deletePackTypeSubscription?: Subscription;
  packtype?: PackType;

  constructor(
    private route: ActivatedRoute,
    private packTypeService: PacktypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if (this.id) {
          // get the data from the api for this category id
          this.packTypeService.getPackTypeById(this.id).subscribe({
            next: (response) => {
              this.packtype = response;
            },
          });
        }
      },
    });
  }

  onFormSubmit(): void {
    const updatePackTypeRequest: UpdatePackTypeRequest = {
      userId: this.packtype?.userId ?? '',
      name: this.packtype?.name ?? '',
      description: this.packtype?.description ?? '',
    };

    // pass this object to service
    if (this.id) {
      this.editPackTypeSubscription = this.packTypeService
        .updatePackType(this.id, updatePackTypeRequest)
        .subscribe({
          next: (response) => {
            ToastrUtils.showToast('Pack Type Updated.');
            this.router.navigateByUrl('/admin/packtype');
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
          this.deletePackTypeSubscription = this.packTypeService
            .deletePackType(this.id)
            .subscribe({
              next: (response) => {
                ToastrUtils.showToast('Pack Type Deleted!');
                this.router.navigateByUrl('/admin/packtype');
              },
            });
        } else {
          ToastrUtils.showErrorToast('Pack Type ID Invalid!');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.editPackTypeSubscription?.unsubscribe();
    this.deletePackTypeSubscription?.unsubscribe();
  }
}
