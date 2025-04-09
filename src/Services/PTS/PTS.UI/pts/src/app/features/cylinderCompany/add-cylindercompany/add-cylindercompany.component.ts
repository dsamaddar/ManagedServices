import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AddCylinderCompanyRequest } from '../models/add-cylindercompany-request.model';

@Component({
  selector: 'app-add-cylindercompany',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-cylindercompany.component.html',
  styleUrl: './add-cylindercompany.component.css'
})
export class AddCylindercompanyComponent {

  model: AddCylinderCompanyRequest;

  constructor (){
    this.model = {
      name : '',
      description : '',
    }
  }

}
