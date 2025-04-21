import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductCodeService } from '../services/productcode.service';
import { ProductCode } from '../models/productcode.model';

@Component({
  selector: 'app-productcode-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './productcode-list.component.html',
  styleUrl: './productcode-list.component.css'
})
export class ProductCodeListComponent implements OnInit {
  
  projects$?: Observable<ProductCode[]>;

  constructor(private productCodeService: ProductCodeService){

  }
  
  ngOnInit(): void {
    this.projects$ = this.productCodeService.getAllProjects();
  }

}
