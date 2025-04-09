import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrintingCompany } from '../models/printingcompany.model';
import { Observable } from 'rxjs';
import { PrintingcompanyService } from '../services/printingcompany.service';

@Component({
  selector: 'app-printingcompany-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './printingcompany-list.component.html',
  styleUrl: './printingcompany-list.component.css'
})
export class PrintingcompanyListComponent implements OnInit {
// observable array
  printingcompanies$?: Observable<PrintingCompany[]>;

  constructor(private printingCompanyService: PrintingcompanyService){}
  
  ngOnInit(): void {
    this.printingcompanies$ = this.printingCompanyService.getAllPrintingCompanies();
    
  }
}
