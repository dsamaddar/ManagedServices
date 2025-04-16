import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent implements OnDestroy {

  model: AddCategoryRequest;
  private addCategorySubscription?: Subscription;

  constructor(private categoryService: CategoryService,
    private router: Router
  ){
    this.model = {
      name: '',
      description: ''
    }
  }
;

  onFormSubmit(){
    this.addCategorySubscription = this.categoryService.AddCategory(this.model)
    .subscribe({
      next: (response) => {

        console.log('this was successful');
        this.router.navigateByUrl('/admin/categories');
      },
      error: (error) => {

      }
    });
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }

}
