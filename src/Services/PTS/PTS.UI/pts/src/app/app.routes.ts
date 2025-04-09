import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { CylindercompanyListComponent } from './features/cylinderCompany/cylindercompany-list/cylindercompany-list.component';
import { PrintingcompanyListComponent } from './features/printingCompany/printingcompany-list/printingcompany-list.component';

export const routes: Routes = [
    {
        path: 'admin/categories',
        component: CategoryListComponent
    },
    {
        path: 'admin/categories/add',
        component: AddCategoryComponent
    },
    {
        path: 'admin/categories/:id',
        component: EditCategoryComponent
    },
    {
        path: 'admin/cylindercompany',
        component: CylindercompanyListComponent
    },
    {
        path: 'admin/printingcompany',
        component: PrintingcompanyListComponent
    }
];
