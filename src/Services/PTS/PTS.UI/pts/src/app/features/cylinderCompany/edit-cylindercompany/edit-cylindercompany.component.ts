import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CylindercompanyService } from '../services/cylindercompany.service';
import { CylinderCompany } from '../models/CylinderCompany.model';
import { CommonModule } from '@angular/common';
import { UpdateCylinderCompanyRequest } from '../models/update-cylindercompany-request.model';

@Component({
  selector: 'app-edit-cylindercompany',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './edit-cylindercompany.component.html',
  styleUrl: './edit-cylindercompany.component.css',
})
export class EditCylindercompanyComponent implements OnInit, OnDestroy {
  id?: number = 0;
  paramsSubscription?: Subscription;
  editCylinderCompanySubscription?: Subscription;
  deleteCylinderCompanySubscription?: Subscription;
  cylindercompany?: CylinderCompany;

  constructor(
    private route: ActivatedRoute,
    private cylinderCompanyService: CylindercompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if (this.id) {
          // get the data from the api for this category id
          this.cylinderCompanyService
            .getCylinderCompanyById(this.id)
            .subscribe({
              next: (response) => {
                this.cylindercompany = response;
              },
            });
        }
      },
    });
  }

  onFormSubmit() {
    const updateCylinderCompanyRequest: UpdateCylinderCompanyRequest = {
      name: this.cylindercompany?.name ?? '',
      description: this.cylindercompany?.description ?? '',
    };

    // pass this object to service
    if (this.id) {
      this.editCylinderCompanySubscription = this.cylinderCompanyService
        .updateCylinderCompany(this.id, updateCylinderCompanyRequest)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/cylindercompany');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.editCylinderCompanySubscription?.unsubscribe();
    this.deleteCylinderCompanySubscription?.unsubscribe();
  }

  onDelete() {
    if (this.id) {
      this.deleteCylinderCompanySubscription = this.cylinderCompanyService
        .deleteCylinderCompany(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/cylindercompany');
          },
        });
    }
  }
}
