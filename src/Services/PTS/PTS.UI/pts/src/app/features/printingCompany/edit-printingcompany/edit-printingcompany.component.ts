import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrintingcompanyService } from '../services/printingcompany.service';
import { PrintingCompany } from '../models/printingcompany.model';
import { Subscription } from 'rxjs';
import { UpdatePrintingCompanyRequest } from '../models/update-printingcompany.model';

@Component({
  selector: 'app-edit-printingcompany',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-printingcompany.component.html',
  styleUrl: './edit-printingcompany.component.css'
})
export class EditPrintingcompanyComponent implements OnInit, OnDestroy {

  id?: number = 0;
  paramsSubscription?: Subscription;
  editPrintingCompanySubscription?: Subscription;
  deletePrintingCompanySubscription?: Subscription;
  printingCompany?: PrintingCompany;

  constructor(private route: ActivatedRoute,
    private printingCompanyService: PrintingcompanyService,
    private router: Router){

  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if(this.id){
          // get the data from the api for this category id
          this.printingCompanyService.getPrintingCompanyById(this.id)
          .subscribe({
            next: (response) => {
              this.printingCompany = response;
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editPrintingCompanySubscription?.unsubscribe();
    this.deletePrintingCompanySubscription?.unsubscribe();
  }

  onFormSubmit():void{
      const updatePrintingCompanyRequest: UpdatePrintingCompanyRequest = {
        name: this.printingCompany?.name ?? '',
        description: this.printingCompany?.description ?? ''
      }
  
      // pass this object to service
      if(this.id){
        this.editPrintingCompanySubscription = this.printingCompanyService.updatePrintingCompany(this.id, updatePrintingCompanyRequest)
        .subscribe({
          next: (response) =>{
            this.router.navigateByUrl('/admin/printingcompany')
          }
        });
      }
    }
  
    onDelete(): void {
      if(this.id){
        this.deletePrintingCompanySubscription = this.printingCompanyService.deletePrintingCompany(this.id)
        .subscribe({
          next: (response) => {
            this.router.navigateByUrl('/admin/printingcompany');
          }
        });
      }
    }



}
