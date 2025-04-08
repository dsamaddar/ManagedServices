import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {

  model: AddCategoryRequest;

  constructor(private categoryService: CategoryService){
    this.model = {
      name: '',
      description: ''
    }
  };

  onFormSubmit(){
    this.categoryService.AddCategory(this.model)
    .subscribe({
      next: (response) => {
        console.log('this was successful');
      },
      error: (error) => {

      }
    });
  }

}
