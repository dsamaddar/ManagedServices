import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CylinderCompany } from '../models/CylinderCompany.model';
import { CylindercompanyService } from '../services/cylindercompany.service';

@Component({
  selector: 'app-cylindercompany-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './cylindercompany-list.component.html',
  styleUrl: './cylindercompany-list.component.css'
})
export class CylindercompanyListComponent implements OnInit {

  cylinderCompanies$?: Observable<CylinderCompany[]>;

  constructor(private cylinderCompanyService: CylindercompanyService){

  }
  ngOnInit(): void {
    this.cylinderCompanies$ = this.cylinderCompanyService.getAllCylinderCompanies();
  }

}
