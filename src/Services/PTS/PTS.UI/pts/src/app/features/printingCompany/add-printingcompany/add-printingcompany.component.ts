import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AddPrintingCompanyRequest } from '../models/add-printingcompany.model';
import { Subscription } from 'rxjs';
import { PrintingcompanyService } from '../services/printingcompany.service';

@Component({
  selector: 'app-add-printingcompany',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-printingcompany.component.html',
  styleUrl: './add-printingcompany.component.css'
})
export class AddPrintingcompanyComponent implements OnDestroy {

  model: AddPrintingCompanyRequest;
  private addPrintingCompanySubscription?: Subscription;

  constructor(private printingCompanyService: PrintingcompanyService,
    private router: Router
  ){
    this.model = {
      name: '',
      description: ''
    }
  }
;

  onFormSubmit(){
    this.addPrintingCompanySubscription = this.printingCompanyService.AddPrintingCompany(this.model)
    .subscribe({
      next: (response) => {

        console.log('this was successful');
        this.router.navigateByUrl('/admin/printingcompany');
      },
      error: (error) => {

      }
    });
  }

  ngOnDestroy(): void {
    this.addPrintingCompanySubscription?.unsubscribe();
  }
}
