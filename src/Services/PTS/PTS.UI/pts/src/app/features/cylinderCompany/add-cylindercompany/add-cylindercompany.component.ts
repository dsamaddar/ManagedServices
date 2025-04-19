import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AddCylinderCompanyRequest } from '../models/add-cylindercompany-request.model';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CylindercompanyService } from '../services/cylindercompany.service';
import { ToastrUtils } from '../../../utils/toastr-utils';

@Component({
  selector: 'app-add-cylindercompany',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-cylindercompany.component.html',
  styleUrl: './add-cylindercompany.component.css'
})
export class AddCylindercompanyComponent implements OnDestroy {

  model: AddCylinderCompanyRequest;
  private addCylinderCompanySubscription?: Subscription;
  

  constructor (private cylinderCompanyService: CylindercompanyService,
    private router: Router
  ){
    this.model = {
      name : '',
      description : '',
      userId: '',
    }
  }
  

  onFormSubmit(){
    this.model.userId = String( localStorage.getItem('user-id'));
    this.addCylinderCompanySubscription = this.cylinderCompanyService?.addCylinderCompany(this.model)
    .subscribe({
      next: (response) => {

        ToastrUtils.showToast('Company Added.');
        this.router.navigateByUrl('/admin/cylindercompany');
      },
      error: (error) => {
        ToastrUtils.showErrorToast(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.addCylinderCompanySubscription?.unsubscribe();
  }

}
