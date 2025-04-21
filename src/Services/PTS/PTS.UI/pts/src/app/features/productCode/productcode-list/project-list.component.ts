import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductCodeService } from '../services/productcode.service';
import { ProductCode } from '../models/productcode.model';

@Component({
  selector: 'app-project-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  
  projects$?: Observable<ProductCode[]>;

  constructor(private productCodeService: ProductCodeService){

  }
  
  ngOnInit(): void {
    this.projects$ = this.productCodeService.getAllProjects();
  }

}
