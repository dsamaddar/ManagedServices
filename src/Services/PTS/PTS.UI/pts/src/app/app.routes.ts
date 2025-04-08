import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';

export const routes: Routes = [
    {
        path: 'admin/categories',
        component: CategoryListComponent
    }
];
