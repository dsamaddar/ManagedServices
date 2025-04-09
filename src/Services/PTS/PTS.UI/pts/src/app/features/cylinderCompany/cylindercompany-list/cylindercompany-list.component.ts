import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CylinderCompany } from '../models/CylinderCompany.model';

@Component({
  selector: 'app-cylindercompany-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './cylindercompany-list.component.html',
  styleUrl: './cylindercompany-list.component.css'
})
export class CylindercompanyListComponent {

  cylinderCompanies$?: Observable<CylinderCompany[]>;

}
