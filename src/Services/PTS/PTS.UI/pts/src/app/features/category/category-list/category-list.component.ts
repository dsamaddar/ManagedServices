import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {

  // observable array
  categories$?: Observable<Category[]>;

  constructor(private categorySerivce: CategoryService){}
  
  ngOnInit(): void {
    this.categories$ = this.categorySerivce.getAllCategories();
    
  }

}
